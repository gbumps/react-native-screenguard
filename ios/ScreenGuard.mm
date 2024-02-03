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

- (void)secureViewWithImage: (id) source
                  withWidth: (nonnull NSNumber *) width
                 withHeight: (nonnull NSNumber *) height
              withAlignment: (Alignment) alignment
        withBackgroundColor: (nonnull NSString *) backgroundColor {
    
  if (@available(iOS 13.0, *)) {
    if (textField == nil) {
      [self initTextField];
    }
      
    CGRect screenRect = [[UIScreen mainScreen] bounds];
    [textField setSecureTextEntry: TRUE];
    [textField setContentMode: UIViewContentModeCenter];
      
    imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, screenRect.size.width, screenRect.size.height)];
      
    imageView.translatesAutoresizingMaskIntoConstraints = NO;
    [imageView setClipsToBounds:TRUE];
      
  
    if ([source isKindOfClass:[NSDictionary class]] && source[@"uri"]) {
        //from an image uri
        NSString *uriImage = source[@"uri"];
        SDWebImageDownloaderOptions downloaderOptions = SDWebImageDownloaderScaleDownLargeImages;
        [imageView sd_setImageWithURL: [NSURL URLWithString: uriImage]
                     placeholderImage: nil
                              options: downloaderOptions
                            completed: ^(UIImage * _Nullable image, NSError * _Nullable error, SDImageCacheType cacheType, NSURL * _Nullable imageURL) {
            if (error) {
                NSLog(@"Error loading image: %@", error);
                return;
            }
            if (image) {
               UIImage *resizedImage = [image sd_resizedImageWithSize: CGSizeMake([width doubleValue], [height doubleValue])
                                                            scaleMode: SDImageScaleModeFill];
               [imageView setImage: resizedImage];
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
            } else {
              NSLog(@"No image data found.");
              return;
            }
        }];
    } else if ([source isKindOfClass:[NSData class]]) {
        //from local React Native directory (usually require('./XXX.png'))
        UIImage *resizedImage = [[UIImage imageWithData:source] sd_resizedImageWithSize: CGSizeMake([width doubleValue], [height doubleValue])
                                                      scaleMode: SDImageScaleModeFill];
        [imageView setImage: resizedImage];
    }
      
    [textField addSubview: imageView];
    [textField sendSubviewToBack: imageView];
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

RCT_EXPORT_METHOD(activateWithoutShield) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self removeScreenShot];
  });
  [center removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  [center removeObserver:UIScreenCapturedDidChangeNotification];
  
  [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                      object:nil
                       queue:mainQueue
                  usingBlock:^(NSNotification *notification) {
    
    if (hasListeners) {
      [self emit:SCREENSHOT_EVT body:nil];
    }
  }];
    [center addObserverForName:UIScreenCapturedDidChangeNotification
                        object:nil
                         queue:mainQueue
                    usingBlock:^(NSNotification *notification) {
      
      if (hasListeners) {
        [self emit:SCREEN_RECORDING_EVT body:nil];
      }
    }];
}

RCT_EXPORT_METHOD(activateShieldWithBlurView: (nonnull NSNumber *)borderRadius) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *presentedViewController = RCTPresentedViewController();
    [self secureViewWithBlurView: borderRadius];
  });
}

RCT_EXPORT_METHOD(activateShieldWithImage: (nonnull NSDictionary *)data) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  if (![data isKindOfClass:[NSDictionary class]]) {
    return;
  }
    
  id source = data[@"source"];
  NSNumber *width = data[@"width"];
  NSNumber *height = data[@"height"];
  NSString *backgroundColor = data[@"backgroundColor"];
  NSInteger alignment = [data[@"alignment"] integerValue];
  Alignment dataAlignment = (Alignment)alignment;
    
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *presentedViewController = RCTPresentedViewController();
    [self secureViewWithImage: source
                    withWidth: width
                   withHeight: height
                withAlignment: dataAlignment
          withBackgroundColor: backgroundColor];
  });
}

RCT_EXPORT_METHOD(deactivateShield) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self removeScreenShot];
  });
  [[NSNotificationCenter defaultCenter]removeObserver:UIApplicationUserDidTakeScreenshotNotification];
    [[NSNotificationCenter defaultCenter]removeObserver:UIScreenCapturedDidChangeNotification];

}

RCT_EXPORT_METHOD(registerScreenShotEventListener) {
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
    [center removeObserver:self
                      name:UIApplicationUserDidTakeScreenshotNotification
                    object:nil];
    [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                        object:nil
                         queue:mainQueue
                    usingBlock:^(NSNotification *notification) {
      
      if (hasListeners) {
        [self emit:SCREENSHOT_EVT body:nil];
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
