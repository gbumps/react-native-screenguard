#import "ScreenGuard.h"
#import "SDWebImage/SDWebImage.h"
#import <React/RCTRootView.h>
#import <React/RCTComponent.h>
#import <React/RCTImageLoader.h>

NSString * const SCREENSHOT_EVT = @"onScreenShotCaptured";
NSString * const SCREEN_RECORDING_EVT = @"onScreenRecordingCaptured";


@implementation ScreenGuard
RCT_EXPORT_MODULE(ScreenGuard)

bool hasListeners;

UITextField *textField;
UIImageView *imageView;
UIScrollView *scrollView;

- (NSArray<NSString *> *)supportedEvents {
  return @[SCREENSHOT_EVT, SCREEN_RECORDING_EVT];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)secureViewWithBackgroundColor: (NSString *)color {
  if (@available(iOS 13.0, *)) {
    if (textField == nil) {
      [self initTextField];
    }
    [textField setSecureTextEntry: TRUE];
    [textField setBackgroundColor: [self colorFromHexString: color]];
  } else return;
}

- (void)secureViewWithBlurView: (nonnull NSNumber *)radius {
  if (@available(iOS 13.0, *)) {
    if (textField == nil) {
      [self initTextField];
    }
      
    [textField setBackgroundColor: [UIColor clearColor]];
    [textField setSecureTextEntry: TRUE];
    UIViewController *presentedViewController = RCTPresentedViewController();
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
      
    [textField setBackground: blurredImage];
    
  } else return;
}

- (void)secureViewWithImageAlignment: (nonnull NSDictionary *) source
                   withDefaultSource: (nullable NSDictionary *) defaultSource
                           withWidth: (nonnull NSNumber *) width
                          withHeight: (nonnull NSNumber *) height
                       withAlignment: (ScreenGuardImageAlignment) alignment
                 withBackgroundColor: (nonnull NSString *) backgroundColor 
{
  if (@available(iOS 13.0, *)) {
    if (textField == nil) {
      [self initTextField];
    }

    [textField setSecureTextEntry: TRUE];
    [textField setContentMode: UIViewContentModeCenter];
    if (scrollView == nil) {
        scrollView = [[UIScrollView alloc] initWithFrame:[UIScreen mainScreen].bounds];
    }
    scrollView.showsHorizontalScrollIndicator = NO;
    scrollView.showsVerticalScrollIndicator = NO;
    scrollView.scrollEnabled = false;
    imageView = [[UIImageView alloc] initWithFrame: CGRectMake(0, 0, [width doubleValue], [height doubleValue])];
        
    imageView.translatesAutoresizingMaskIntoConstraints = NO;
    [imageView setClipsToBounds:TRUE];
    [scrollView addSubview:imageView];
      
    if (source[@"uri"] != nil) {
        NSString *uriImage = source[@"uri"];
        NSString *uriDefaultSource = defaultSource[@"uri"];
        
        NSURL *urlDefaultSource = [NSURL URLWithString: uriDefaultSource];
        
        SDWebImageDownloaderOptions downloaderOptions = SDWebImageDownloaderScaleDownLargeImages;
        
        UIImage *thumbnailImage = uriDefaultSource != nil ? [UIImage imageWithData: [NSData dataWithContentsOfURL: urlDefaultSource]] : nil;
        
        [imageView sd_setImageWithURL: [NSURL URLWithString: uriImage]
                     placeholderImage: thumbnailImage
                              options: downloaderOptions
                            completed: ^(UIImage * _Nullable image, NSError * _Nullable error, SDImageCacheType cacheType, NSURL * _Nullable imageURL) {
             switch (alignment) {
                 case AlignmentTopLeft:
                     [imageView setContentMode: UIViewContentModeTopLeft];
                     break;
                 case AlignmentTopCenter:
                     [imageView setContentMode: UIViewContentModeTop];
                     break;
                 case AlignmentTopRight:
                     [imageView setContentMode: UIViewContentModeTopRight];
                     break;
                 case AlignmentCenterLeft:
                     [imageView setContentMode: UIViewContentModeLeft];
                     break;
                 case AlignmentCenter:
                     [imageView setContentMode: UIViewContentModeCenter];
                     break;
                 case AlignmentCenterRight:
                     [imageView setContentMode: UIViewContentModeRight];
                     break;
                 case AlignmentBottomLeft:
                     [imageView setContentMode: UIViewContentModeBottomLeft];
                     break;
                 case AlignmentBottomCenter:
                     [imageView setContentMode: UIViewContentModeBottom];
                     break;
                 case AlignmentBottomRight:
                     [imageView setContentMode: UIViewContentModeBottomRight];
                     break;
             }
        }];
    }
      
    [textField addSubview: scrollView];
    [textField sendSubviewToBack: scrollView];
    [textField setBackgroundColor: [self colorFromHexString: backgroundColor]];
  } else return;
}

- (void)secureViewWithImagePosition: (nonnull NSDictionary *) source
                  withDefaultSource: (nullable NSDictionary *) defaultSource
                          withWidth: (nonnull NSNumber *) width
                         withHeight: (nonnull NSNumber *) height
                            withTop: (NSNumber *) top
                           withLeft: (NSNumber *) left
                         withBottom: (NSNumber *) bottom
                          withRight: (NSNumber *) right
                withBackgroundColor: (nonnull NSString *) backgroundColor
{
 if (@available(iOS 13.0, *)) {
   if (textField == nil) {
     [self initTextField];
   }
   [textField setSecureTextEntry: TRUE];
   [textField setContentMode: UIViewContentModeCenter];
   if (scrollView == nil) {
     scrollView = [[UIScrollView alloc] initWithFrame:[UIScreen mainScreen].bounds];
     scrollView.showsHorizontalScrollIndicator = NO;
     scrollView.showsVerticalScrollIndicator = NO;
     scrollView.scrollEnabled = false;
   }
   CGFloat topInset = top ? [top doubleValue] : 0;
   CGFloat leftInset = left ? [left doubleValue] : 0;
   CGFloat bottomInset = bottom ? [bottom doubleValue] : 0;
   CGFloat rightInset = right ? [right doubleValue] : 0;
     
   scrollView.contentInset = UIEdgeInsetsMake(topInset, leftInset, bottomInset, rightInset);
   
   imageView = [[UIImageView alloc] initWithFrame: CGRectMake(0, 0, [width doubleValue], [height doubleValue])];
     
   imageView.translatesAutoresizingMaskIntoConstraints = NO;
     
   [imageView setClipsToBounds:TRUE];
   [scrollView addSubview:imageView];
     
   if (source[@"uri"] != nil) {
       NSString *uriImage = source[@"uri"];
       NSString *uriDefaultSource = defaultSource[@"uri"];
       
       NSURL *urlDefaultSource = [NSURL URLWithString: uriDefaultSource];
       
       SDWebImageDownloaderOptions downloaderOptions = SDWebImageDownloaderScaleDownLargeImages;
       
       UIImage *thumbnailImage = uriDefaultSource != nil ? [UIImage imageWithData: [NSData dataWithContentsOfURL: urlDefaultSource]] : nil;
       
       [imageView sd_setImageWithURL: [NSURL URLWithString: uriImage]
                    placeholderImage: thumbnailImage
                             options: downloaderOptions
                           completed: ^(UIImage * _Nullable image, NSError * _Nullable error, SDImageCacheType cacheType, NSURL * _Nullable imageURL) {
       }];
   }
     
   [textField addSubview: scrollView];
   [textField sendSubviewToBack: scrollView];
   [textField setBackgroundColor: [self colorFromHexString: backgroundColor]];
 } else return;
}

- (void) initTextField {
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    textField = [[UITextField alloc] initWithFrame:CGRectMake(0, 0, screenRect.size.width, screenRect.size.height)];
    textField.translatesAutoresizingMaskIntoConstraints = NO;
    
    [textField setTextAlignment:NSTextAlignmentCenter];
    [textField setUserInteractionEnabled: NO];

    UIWindow *window = [UIApplication sharedApplication].keyWindow;
    [window makeKeyAndVisible];
    [window.layer.superlayer addSublayer:textField.layer];

    if (textField.layer.sublayers.firstObject) {
        [textField.layer.sublayers.firstObject addSublayer: window.layer];
    }
}


- (void)removeScreenShot {
  UIWindow *window = [UIApplication sharedApplication].keyWindow;
  if (textField != nil) {
      if (imageView != nil) {
          [imageView setImage: nil];
          [imageView removeFromSuperview];
      }
      if (scrollView != nil) {
          [scrollView removeFromSuperview];
      }
    [textField setSecureTextEntry: FALSE];
    [textField setBackgroundColor: [UIColor clearColor]];
    [textField setBackground: nil];
    CALayer *textFieldLayer = textField.layer.sublayers.firstObject;
    if ([window.layer.superlayer.sublayers containsObject:textFieldLayer]) {
       [textFieldLayer removeFromSuperlayer];
    }
  }
}

- (UIColor *)colorFromHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // bypass '#' character
    [scanner scanHexInt:&rgbValue];
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
}

- (UIImage *)convertViewToImage:(UIView *)view {
    UIGraphicsBeginImageContextWithOptions(view.bounds.size, view.opaque, 0.0);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}


RCT_EXPORT_METHOD(activateShield: (NSString *)screenshotBackgroundColor) {
  dispatch_async(dispatch_get_main_queue(), ^{
      [self secureViewWithBackgroundColor: screenshotBackgroundColor];
  });
}

RCT_EXPORT_METHOD(activateShieldWithBlurView: (nonnull NSNumber *)borderRadius) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self secureViewWithBlurView: borderRadius];
  });
}

RCT_EXPORT_METHOD(activateShieldWithImage: (nonnull NSDictionary *)data) {
  if (![data isKindOfClass:[NSDictionary class]]) {
    return;
  }
    
  NSDictionary *source = data[@"source"];
  NSDictionary *defaultSource = data[@"defaultSource"];
  NSNumber *width = data[@"width"];
  NSNumber *height = data[@"height"];
  NSNumber *top = data[@"top"];
  NSNumber *left = data[@"left"];
  NSNumber *bottom = data[@"bottom"];
  NSNumber *right = data[@"right"];
  NSString *backgroundColor = data[@"backgroundColor"];
  NSNumber *alignment = data[@"alignment"];
    if (alignment != nil) {
        NSInteger alignment = [data[@"alignment"] integerValue];
        ScreenGuardImageAlignment dataAlignment = (ScreenGuardImageAlignment)alignment;
        dispatch_async(dispatch_get_main_queue(), ^{
            [self secureViewWithImageAlignment: source
                             withDefaultSource: defaultSource
                                     withWidth: width
                                    withHeight: height
                                 withAlignment: dataAlignment
                           withBackgroundColor: backgroundColor];
        });
    } else {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self secureViewWithImagePosition: source
                            withDefaultSource: defaultSource
                                    withWidth: width
                                   withHeight: height
                                      withTop: top
                                     withLeft: left
                                   withBottom: bottom
                                    withRight: right
                          withBackgroundColor: backgroundColor];
        });
    }
    
}

RCT_EXPORT_METHOD(deactivateShield) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self removeScreenShot];
    [[NSNotificationCenter defaultCenter]removeObserver:UIApplicationUserDidTakeScreenshotNotification];
    [[NSNotificationCenter defaultCenter]removeObserver:UIScreenCapturedDidChangeNotification];
  });
}

RCT_EXPORT_METHOD(registerScreenShotEventListener: (BOOL) getScreenShotPath) {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
    [center removeObserver:self
                      name:UIApplicationUserDidTakeScreenshotNotification
                    object:nil];
    [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                        object:nil
                         queue:mainQueue
                    usingBlock:^(NSNotification *notification) {
      
      if (hasListeners && getScreenShotPath) {
          UIViewController *presentedViewController = RCTPresentedViewController();

          UIImage *image = [self convertViewToImage:presentedViewController.view.superview];
                  NSData *data = UIImagePNGRepresentation(image);
                  if (!data) {
                      [self emit:SCREENSHOT_EVT body: nil];
                    // reject(@"error", @"Failed to convert image to PNG", nil);
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
          [self emit:SCREENSHOT_EVT body: result];
      } else if (hasListeners) {
          [self emit:SCREENSHOT_EVT body: nil];
      }
    }];
}

RCT_EXPORT_METHOD(registerScreenRecordingEventListener) {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
    [center removeObserver:self
                      name:UIScreenCapturedDidChangeNotification
                    object:nil];
    [center addObserverForName:UIScreenCapturedDidChangeNotification
                        object:nil
                         queue:mainQueue
                    usingBlock:^(NSNotification *notification) {
      
      if (hasListeners) {
        [self emit:SCREEN_RECORDING_EVT body:nil];
      }
    }];
}

RCT_EXPORT_METHOD(removeEvent) {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
    [center removeObserver:self
                      name:UIApplicationUserDidTakeScreenshotNotification
                    object:nil];
    [center removeObserver:self
                      name:UIScreenCapturedDidChangeNotification
                    object:nil];
}


@end

// // Don't compile this code when we build for the old architecture.
// #ifdef RCT_NEW_ARCH_ENABLED
// - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//     (const facebook::react::ObjCTurboModule::InitParams &)params
// {
//     return std::make_shared<facebook::react::NativeScreenguardSpecJSI>(params);
// }
// #endif
