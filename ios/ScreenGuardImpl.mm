#import "ScreenGuardImpl.h"
#import "ScreenGuardConstants.h"
#import "SDWebImage/SDWebImage.h"
#import <React/RCTUtils.h>
#import <React/RCTImageLoader.h>

NSString * const SCREEN_GUARD_EVT = @"onScreenGuardEvt";
NSString * const SCREENSHOT_EVT = @"onScreenShotCaptured";
NSString * const SCREEN_RECORDING_EVT = @"onScreenRecordingCaptured";

@interface ScreenGuardImpl()
@property (nonatomic, strong) UITextField *textField;
@property (nonatomic, strong) UIImageView *imageView;
@property (nonatomic, strong) UIScrollView *scrollView;
@property (nonatomic, strong) NSDictionary *config;
@property (nonatomic, weak) RCTEventEmitter *eventEmitter;

// Overlay
@property (nonatomic, strong) UIView *overlayView;

// Observers
@property (nonatomic, strong) id screenshotObserver;
@property (nonatomic, strong) id screenRecordingObserver;

// State
@property (nonatomic) BOOL isMultitasking;
@property (nonatomic) BOOL isRecording;
@property (nonatomic, strong) NSString *currentMethod;
@property (nonatomic) NSInteger currentScreenshotCount;

@end

@implementation ScreenGuardImpl

+ (instancetype)shared {
    static ScreenGuardImpl *sharedInstance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[ScreenGuardImpl alloc] init];
    });
    return sharedInstance;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        _isMultitasking = NO;
        _isRecording = NO;
        _currentMethod = @"";
        _currentScreenshotCount = 0;
        [self registerAppLifecycleListeners];
    }
    return self;
}

- (void)registerAppLifecycleListeners {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppWillResignActive) name:UIApplicationWillResignActiveNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleAppDidBecomeActive) name:UIApplicationDidBecomeActiveNotification object:nil];
}

- (void)setEventEmitter:(RCTEventEmitter *)emitter {
    _eventEmitter = emitter;
}

- (void)reset {
    [self removeScreenShot];
    [self removeOverlay]; 
    [self removeScreenshotEventListener];
    [self removeScreenRecordingEventListener];
    _config = nil;
    _currentMethod = @"";
    _currentScreenshotCount = 0;
}

- (void)configureWithParams:(NSDictionary *)params {
    _config = [params copy];
    NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
    [ud setObject:_config forKey:kSGUserDefaultsConfig];
    [ud synchronize];
    
    BOOL getScreenshotPath = NO;
    if (params[kSGConfigGetScreenshotPath] != nil) {
        getScreenshotPath = [params[kSGConfigGetScreenshotPath] boolValue];
    }
    [self registerScreenRecordingEventListener:YES];
    
    [self logAction:kSGActionInit status:NO];
    [self applySecureState];
}

#pragma mark - Logic Core

- (void)handleAppWillResignActive {
    _isMultitasking = YES;
    [self applySecureState];
}

- (void)handleAppDidBecomeActive {
    _isMultitasking = NO;
    [self applySecureState];
}

- (void)applySecureState {
    if (_textField == nil) return;
    
    BOOL enableCapture = [_config[kSGConfigEnableCapture] boolValue];
    BOOL enableRecord = [_config[kSGConfigEnableRecord] boolValue];
    BOOL enableContentMultitask = [_config[kSGConfigEnableMultitask] boolValue];
    
    BOOL shouldSecure = YES;
    
    if (_isMultitasking) {
        shouldSecure = !enableContentMultitask;
    } else {
        BOOL isRec = [UIScreen mainScreen].isCaptured;
        
        if (enableCapture && !enableRecord) {
            shouldSecure = isRec ? YES : NO;
        } else if (!enableCapture && enableRecord) {
            shouldSecure = isRec ? NO : YES;
        } else if (enableCapture && enableRecord) {
             shouldSecure = NO;
        } else {
             shouldSecure = YES;
        }
    }
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self->_textField setSecureTextEntry:shouldSecure];
        [self sendStateEvent:shouldSecure];
    });
}

#pragma mark - Overlay Logic

- (void)showOverlay:(BOOL)persistent {
    if (_textField == nil) return;
    
    dispatch_async(dispatch_get_main_queue(), ^{
        [self removeOverlay];
        
        UIWindow *keyWindow = RCTKeyWindow();
        if (!keyWindow) return;
        
        self->_overlayView = [[UIView alloc] initWithFrame:keyWindow.bounds];
        self->_overlayView.backgroundColor = self->_textField.backgroundColor;
        self->_overlayView.userInteractionEnabled = NO; 
        
        if (self->_textField.background) {
            UIImageView *bgImageView = [[UIImageView alloc] initWithFrame:self->_overlayView.bounds];
            bgImageView.image = self->_textField.background;
            bgImageView.contentMode = UIViewContentModeScaleAspectFill;
            [self->_overlayView addSubview:bgImageView];
        }
        
        if (self->_imageView && self->_imageView.superview) {
            UIImageView *imgCopy = [[UIImageView alloc] initWithFrame:self->_imageView.frame];
            imgCopy.image = self->_imageView.image;
            imgCopy.contentMode = self->_imageView.contentMode;
            imgCopy.clipsToBounds = self->_imageView.clipsToBounds;
            
            [self->_overlayView addSubview:imgCopy];
        }
        
        [keyWindow addSubview:self->_overlayView];
        [keyWindow bringSubviewToFront:self->_overlayView];
        
        if (!persistent) {
             double delayInSeconds = [self->_config[kSGConfigTimeAfterResume] doubleValue] / 1000.0;
             if (delayInSeconds <= 0) delayInSeconds = 1.0;
             
             dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, (int64_t)(delayInSeconds * NSEC_PER_SEC));
             dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                [self removeOverlay];
            });
        }
    });
}

- (void)removeOverlay {
    dispatch_async(dispatch_get_main_queue(), ^{
        if (self->_overlayView) {
            [self->_overlayView removeFromSuperview];
            self->_overlayView = nil;
        }
    });
}


#pragma mark - Secure View Methods

- (void)initTextField {
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    _textField = [[UITextField alloc] initWithFrame:CGRectMake(0, 0, screenRect.size.width, screenRect.size.height)];
    _textField.translatesAutoresizingMaskIntoConstraints = NO;
    
    [_textField setTextAlignment:NSTextAlignmentCenter];
    [_textField setUserInteractionEnabled: NO];
    
    UIWindow *window = RCTKeyWindow();
    [window makeKeyAndVisible];
    [window.layer.superlayer addSublayer:_textField.layer];
    
    if (_textField.layer.sublayers.firstObject) {
        [_textField.layer.sublayers.firstObject addSublayer: window.layer];
    }
}

- (void)secureViewWithBackgroundColor:(NSString *)color {
    if (@available(iOS 13.0, *)) {
        if (_textField == nil) {
            [self initTextField];
        }
        [_textField setBackgroundColor: [self colorFromHexString: color]];
        _currentMethod = kSGMethodColor;
        [self applySecureState];
    }
}

- (void)secureViewWithBlurView:(NSNumber *)radius {
    if (@available(iOS 13.0, *)) {
        if (_textField == nil) {
            [self initTextField];
        }
        
        [_textField setBackgroundColor: [UIColor clearColor]];
        UIViewController *presentedViewController = RCTPresentedViewController();
        if (presentedViewController) {
             UIImage *imageView = [self convertViewToImage:presentedViewController.view.superview];
             CIImage *inputImage = [CIImage imageWithCGImage:imageView.CGImage];
             
             CIContext *context = [CIContext contextWithOptions:nil];
             
             CIFilter *blurFilter = [CIFilter filterWithName:@"CIGaussianBlur"];
             [blurFilter setValue:inputImage forKey:kCIInputImageKey];
             [blurFilter setValue:radius forKey:kCIInputRadiusKey];
             
             CIImage *outputImage = [blurFilter valueForKey:kCIOutputImageKey];
             
             CGImageRef cgImage = [context createCGImage:outputImage fromRect:[outputImage extent]];
             
             UIImage *blurredImage = [UIImage imageWithCGImage:cgImage];
             
             CGImageRelease(cgImage);
             
             [_textField setBackground: blurredImage];
        }
        _currentMethod = kSGMethodBlur;
        [self applySecureState];
    }
}

- (void)secureViewWithImageAlignment:(NSDictionary *)source
                   withDefaultSource:(NSDictionary *)defaultSource
                           withWidth:(NSNumber *)width
                          withHeight:(NSNumber *)height
                       withAlignment:(ScreenGuardImageAlignment)alignment
                 withBackgroundColor:(NSString *)backgroundColor
{
    if (@available(iOS 13.0, *)) {
        if (_textField == nil) {
            [self initTextField];
        }
        
        [_textField setContentMode: UIViewContentModeCenter];
        
        _imageView = [[UIImageView alloc] initWithFrame: CGRectMake(0, 0, [width doubleValue], [height doubleValue])];
        
        _imageView.translatesAutoresizingMaskIntoConstraints = NO;
        [_imageView setClipsToBounds:YES];
        
        if (source[@"uri"] != nil) {
            NSString *uriImage = source[@"uri"];
            NSString *uriDefaultSource = defaultSource[@"uri"];
            NSURL *urlDefaultSource = [NSURL URLWithString: uriDefaultSource];
            SDWebImageDownloaderOptions downloaderOptions = SDWebImageDownloaderScaleDownLargeImages;
            UIImage *thumbnailImage = uriDefaultSource != nil ? [UIImage imageWithData: [NSData dataWithContentsOfURL: urlDefaultSource]] : nil;
            
            [_imageView sd_setImageWithURL: [NSURL URLWithString: uriImage]
                          placeholderImage: thumbnailImage
                                   options: downloaderOptions
                                 completed: nil];
        }
        if (_scrollView == nil) {
            _scrollView = [[UIScrollView alloc] initWithFrame:[UIScreen mainScreen].bounds];
            _scrollView.showsHorizontalScrollIndicator = NO;
            _scrollView.showsVerticalScrollIndicator = NO;
            _scrollView.scrollEnabled = false;
        }
        [self setImageView: alignment];
        [_textField addSubview: _scrollView];
        [_textField sendSubviewToBack: _scrollView];
        [_textField setBackgroundColor: [self colorFromHexString: backgroundColor]];
        _currentMethod = kSGMethodImage;
        [self applySecureState];
    }
}

- (void)secureViewWithImagePosition:(NSDictionary *)source
                  withDefaultSource:(NSDictionary *)defaultSource
                          withWidth:(NSNumber *)width
                         withHeight:(NSNumber *)height
                            withTop:(NSNumber *)top
                           withLeft:(NSNumber *)left
                         withBottom:(NSNumber *)bottom
                          withRight:(NSNumber *)right
                withBackgroundColor:(NSString *)backgroundColor
{
    if (@available(iOS 13.0, *)) {
        if (_textField == nil) {
            [self initTextField];
        }
        [_textField setContentMode: UIViewContentModeCenter];
        
        if (_scrollView == nil) {
            _scrollView = [[UIScrollView alloc] initWithFrame:[UIScreen mainScreen].bounds];
            _scrollView.showsHorizontalScrollIndicator = NO;
            _scrollView.showsVerticalScrollIndicator = NO;
            _scrollView.scrollEnabled = false;
        }
        
        _imageView = [[UIImageView alloc] initWithFrame: CGRectMake(0, 0, [width doubleValue], [height doubleValue])];
        _imageView.translatesAutoresizingMaskIntoConstraints = NO;
        [_imageView setClipsToBounds: TRUE];
        
        if (source[@"uri"] != nil) {
            NSString *uriImage = source[@"uri"];
            NSString *uriDefaultSource = defaultSource[@"uri"];
            NSURL *urlDefaultSource = [NSURL URLWithString: uriDefaultSource];
            SDWebImageDownloaderOptions downloaderOptions = SDWebImageDownloaderScaleDownLargeImages;
            UIImage *thumbnailImage = uriDefaultSource != nil ? [UIImage imageWithData: [NSData dataWithContentsOfURL: urlDefaultSource]] : nil;
            
            [_imageView sd_setImageWithURL: [NSURL URLWithString: uriImage]
                          placeholderImage: thumbnailImage
                                   options: downloaderOptions
                                 completed: nil];
        }
        [self setImageViewBasedOnPosition:[top doubleValue] left:[left doubleValue] bottom:[bottom doubleValue] right:[right doubleValue]];
        
        [_textField addSubview: _scrollView];
        [_textField sendSubviewToBack: _scrollView];
        [_textField setBackgroundColor: [self colorFromHexString: backgroundColor]];
        _currentMethod = kSGMethodImage;
        [self applySecureState];
    }
}

- (void)removeScreenShot {
    dispatch_async(dispatch_get_main_queue(), ^{
        [self removeOverlay];
        UIWindow *window = RCTKeyWindow();
        if (self->_textField != nil) {
            if (self->_imageView != nil) {
                [self->_imageView setImage: nil];
                [self->_imageView removeFromSuperview];
            }
            if (self->_scrollView != nil) {
                [self->_scrollView removeFromSuperview];
            }
            [self->_textField setSecureTextEntry: FALSE];
            [self->_textField setBackgroundColor: [UIColor clearColor]];
            [self->_textField setBackground: nil];
            CALayer *textFieldLayer = self->_textField.layer.sublayers.firstObject;
            if ([window.layer.superlayer.sublayers containsObject:textFieldLayer]) {
                [textFieldLayer removeFromSuperlayer];
            }
            self->_currentMethod = @"";
            [self sendStateEvent:NO];
            [self logAction:kSGActionRemoveShield status:NO];
        }
    });
}

#pragma mark - Event Listeners

- (void)registerScreenshotEventListener:(BOOL)getScreenshotPath {
    BOOL currentPath = getScreenshotPath;
    NSMutableDictionary *newConfig = [_config mutableCopy];
    if (newConfig) {
        newConfig[kSGConfigGetScreenshotPath] = @(getScreenshotPath);
        _config = newConfig;
    }
    
    if (_screenshotObserver) {
        [[NSNotificationCenter defaultCenter] removeObserver:_screenshotObserver];
    }
    
    _screenshotObserver = [[NSNotificationCenter defaultCenter] addObserverForName:UIApplicationUserDidTakeScreenshotNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification * _Nonnull note) {
        [self handleScreenshotNotification:note];
        
        BOOL displayOverlay = [self->_config[kSGConfigDisplayOverlay] boolValue];
        if (displayOverlay) {
            [self showOverlay:NO]; 
        }
    }];
}

- (void)removeScreenshotEventListener {
    if (_screenshotObserver) {
        [[NSNotificationCenter defaultCenter] removeObserver:_screenshotObserver];
        _screenshotObserver = nil;
    }
}

- (void)registerScreenRecordingEventListener:(BOOL)getRecordingStatus {
    if (_screenRecordingObserver) {
        [[NSNotificationCenter defaultCenter] removeObserver:_screenRecordingObserver];
    }
    
    _screenRecordingObserver = [[NSNotificationCenter defaultCenter] addObserverForName:UIScreenCapturedDidChangeNotification object:nil queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification * _Nonnull note) {
        [self handleScreenRecordNotification:note];
    }];
}

- (void)removeScreenRecordingEventListener {
    if (_screenRecordingObserver) {
        [[NSNotificationCenter defaultCenter] removeObserver:_screenRecordingObserver];
        _screenRecordingObserver = nil;
    }
}

#pragma mark - Handlers

- (void)handleScreenshotNotification:(NSNotification *)notification {
    _currentScreenshotCount++;
    
    NSNumber *limitCount = _config[kSGConfigLimitCaptureEvtCount];
    if (limitCount != nil && [limitCount integerValue] > 0) {
        if (_currentScreenshotCount < [limitCount integerValue]) {
             // Not reached limit yet
             return;
        }
    }
    
    BOOL getPath = [_config[kSGConfigGetScreenshotPath] boolValue];
  
    if (getPath) {
        UIViewController *presentedViewController = RCTPresentedViewController();
        UIImage *image = [self convertViewToImage:presentedViewController.view.superview];
        NSData *data = UIImagePNGRepresentation(image);
        if (!data) {
             [self sendEvent:SCREENSHOT_EVT body:nil];
            return;
        }
        NSString *tempDir = NSTemporaryDirectory();
        NSString *fileName = [[NSUUID UUID] UUIDString];
        NSString *filePath = [tempDir stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.png", fileName]];
        NSError *error = nil;
        NSDictionary *result;
        BOOL success = [data writeToFile:filePath options:NSDataWritingAtomic error:&error];
        if (!success) {
            result = @{@"path": @"Error retrieving file", @"name": @"", @"type": @""};
        } else {
            result = @{@"path": filePath, @"name": fileName, @"type": @"PNG"};
        }
         [self sendEvent:SCREENSHOT_EVT body:result];
    } else {
         [self sendEvent:SCREENSHOT_EVT body:nil];
    }
    
    [self logAction:kSGActionScreenshotTaken status:_textField.secureTextEntry];
}

- (void)handleScreenRecordNotification:(NSNotification *)notification {
    BOOL isCaptured = [[UIScreen mainScreen] isCaptured];
    NSDictionary *result;
    
    [self applySecureState];
    
    BOOL displayOverlay = [_config[kSGConfigDisplayOverlay] boolValue];
    if (displayOverlay) {
        if (isCaptured) {
            [self showOverlay:YES]; 
        } else {
            [self removeOverlay]; 
        }
    }
    
    [self logAction:isCaptured ? kSGActionRecordingStart : kSGActionRecordingStop status:_textField.secureTextEntry];
    
    if (isCaptured) {
        result = @{@"isRecording": @"true"};
        [self sendEvent:SCREEN_RECORDING_EVT body: result];
     } else {
        result = @{@"isRecording": @"false"};
        [self sendEvent:SCREEN_RECORDING_EVT body: result];
      }
}

- (void)sendStateEvent:(BOOL)isProtected {
    NSDictionary *body = @{
        @"timestamp": @((long)([[NSDate date] timeIntervalSince1970] * 1000)),
        @"method": _currentMethod ?: @"",
        @"isProtected": @(isProtected)
    };
    [self sendEvent:kSGEventScreenGuard body:body];
    
    [self logAction:kSGActionStateChange status:isProtected];
}

- (void)sendEvent:(NSString *)eventName body:(id)body {
    if (_eventEmitter) {
        [_eventEmitter sendEventWithName:eventName body:body];
    }
}

#pragma mark - Logging

- (void)logAction:(NSString *)action status:(BOOL)isProtected {
    BOOL shouldRecord = [_config[kSGConfigTrackingLog] boolValue];
    if (!shouldRecord) return;

    NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
    NSMutableArray *logs = [[ud arrayForKey:kSGUserDefaultsLogs] mutableCopy];
    if (!logs) {
        logs = [NSMutableArray array];
    }
    
    NSDictionary *logEntry = @{
        @"timestamp": @((long)([[NSDate date] timeIntervalSince1970] * 1000)),
        @"action": action ?: @"unknown",
        @"isProtected": @(isProtected),
        @"method": _currentMethod ?: @""
    };
    
    [logs addObject:logEntry];
    
    // Limit logs to last 1000
    if (logs.count > 1000) {
        [logs removeObjectAtIndex:0];
    }
    
    [ud setObject:logs forKey:kSGUserDefaultsLogs];
    [ud synchronize];
}

- (void)getScreenGuardLogs:(NSNumber *)maxCount callback:(void (^)(NSArray *logs))callback {
    NSUserDefaults *ud = [NSUserDefaults standardUserDefaults];
    NSArray *logs = [ud arrayForKey:kSGUserDefaultsLogs];
    
    if (!logs) {
        if (callback) {
            callback(@[]);
        }
        return;
    }

    NSInteger count = [maxCount integerValue];
    if (count > 0 && count < logs.count) {
        // Return the last 'count' number of logs
        NSUInteger loc = logs.count - count;
        NSRange range = NSMakeRange(loc, count);
        NSArray *subArray = [logs subarrayWithRange:range];
        if (callback) {
            callback(subArray);
        }
    } else {
        // Return all logs if count >= logs.count or count <= 0 (though typically count should be > 0)
        // If count is 0 or negative, we might arguably return empty, but usually "max 10" implies "up to 10".
        // The requirement says "maxCount defaults to 10. this variable means get at most that many logs."
        // So if count <= 0, we treat it as "return 0 logs" or "invalid"?
        // Let's assume maxCount > 0. If maxCount <= 0 passed from JS (unexpected due to default), return empty.
        
        if (count <= 0) {
             if (callback) {
                callback(@[]);
            }
        } else {
             if (callback) {
                callback(logs);
            }
        }
    }
}

#pragma mark - Helpers

- (UIColor *)colorFromHexString:(NSString *)hexString {
    if (hexString.length != 7 || ![hexString hasPrefix:@"#"]) {
        return [UIColor whiteColor];
    }
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1];
    if (![scanner scanHexInt:&rgbValue]) {
        return [UIColor whiteColor];
    }
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0
                           green:((rgbValue & 0xFF00) >> 8)/255.0
                            blue:(rgbValue & 0xFF)/255.0
                           alpha:1.0];
}

- (UIImage *)convertViewToImage:(UIView *)view {
    UIGraphicsBeginImageContextWithOptions(view.bounds.size, view.opaque, 0.0);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}

- (void)setImageView:(ScreenGuardImageAlignment)alignment {
    [_scrollView addSubview:_imageView];
    
    CGFloat scrollViewWidth = _scrollView.bounds.size.width;
    CGFloat scrollViewHeight = _scrollView.bounds.size.height;
    CGFloat imageViewWidth = _imageView.bounds.size.width;
    CGFloat imageViewHeight = _imageView.bounds.size.height;
    
    CGPoint imageViewOrigin;
    
    switch (alignment) {
        case AlignmentTopLeft:
            imageViewOrigin = CGPointMake(0, 0);
            break;
        case AlignmentTopCenter:
            imageViewOrigin = CGPointMake((scrollViewWidth - imageViewWidth) / 2, 0);
            break;
        case AlignmentTopRight:
            imageViewOrigin = CGPointMake(scrollViewWidth - imageViewWidth, 0);
            break;
        case AlignmentCenterLeft:
            imageViewOrigin = CGPointMake(0, (scrollViewHeight - imageViewHeight) / 2);
            break;
        case AlignmentCenter:
            imageViewOrigin = CGPointMake((scrollViewWidth - imageViewWidth) / 2, (scrollViewHeight - imageViewHeight) / 2);
            break;
        case AlignmentCenterRight:
            imageViewOrigin = CGPointMake(scrollViewWidth - imageViewWidth, (scrollViewHeight - imageViewHeight) / 2);
            break;
        case AlignmentBottomLeft:
            imageViewOrigin = CGPointMake(0, scrollViewHeight - imageViewHeight);
            break;
        case AlignmentBottomCenter:
            imageViewOrigin = CGPointMake((scrollViewWidth - imageViewWidth) / 2, scrollViewHeight - imageViewHeight);
            break;
        case AlignmentBottomRight:
            imageViewOrigin = CGPointMake(scrollViewWidth - imageViewWidth, scrollViewHeight - imageViewHeight);
            break;
        default:
            imageViewOrigin = CGPointZero;
            break;
    }
    
    _imageView.frame = CGRectMake(imageViewOrigin.x, imageViewOrigin.y, imageViewWidth, imageViewHeight);
    
    CGFloat contentWidth = MAX(scrollViewWidth, imageViewOrigin.x + imageViewWidth);
    CGFloat contentHeight = MAX(scrollViewHeight, imageViewOrigin.y + imageViewHeight);
    _scrollView.contentSize = CGSizeMake(contentWidth, contentHeight);
}

- (void)setImageViewBasedOnPosition:(double)top left:(double)left bottom:(double)bottom right:(double)right {
    [_scrollView addSubview:_imageView];
    
    CGFloat scrollViewWidth = _scrollView.bounds.size.width;
    CGFloat scrollViewHeight = _scrollView.bounds.size.height;
    CGFloat imageViewWidth = _imageView.bounds.size.width;
    CGFloat imageViewHeight = _imageView.bounds.size.height;
    
    CGFloat centerX = scrollViewWidth / 2;
    CGFloat centerY = scrollViewHeight / 2;
    
    CGFloat imageViewX = centerX + left - right - (imageViewWidth / 2);
    CGFloat imageViewY = centerY + top - bottom - (imageViewHeight / 2);
    
    _imageView.frame = CGRectMake(imageViewX, imageViewY, imageViewWidth, imageViewHeight);
    
    CGFloat contentWidth = MAX(scrollViewWidth, fabs(left - right) + imageViewWidth);
    CGFloat contentHeight = MAX(scrollViewHeight, fabs(top - bottom) + imageViewHeight);
    _scrollView.contentSize = CGSizeMake(contentWidth, contentHeight);
}

@end
