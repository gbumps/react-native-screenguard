#import "ScreenGuard.h"


@implementation ScreenGuard
RCT_EXPORT_MODULE(ScreenGuard)

bool hasListeners;
UITextField *textField;

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onSnapper"];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)secureViewWithBackgroundColor: (UIView*)view withScreenShotBackgroundColor:(NSString *)color {
  if (@available(iOS 13.0, *)) {
    if (textField == nil) {
      [self initTextField:view];
    }
    [textField setSecureTextEntry: TRUE];
    [textField setBackgroundColor: [self colorFromHexString: color]];
  } else return;
}

- (void)secureViewWithBlurView: (UIView*)view withBorderRadius:(nonnull NSNumber *)radius {
  if (@available(iOS 13.0, *)) {
    if (textField == nil) {
      [self initTextField:view];
    }
    [textField setBackgroundColor: [UIColor clearColor]];
    [textField setSecureTextEntry: TRUE];
    UIImage *imageView = [self convertViewToImage:view];
    CIImage *inputImage = [CIImage imageWithCGImage:imageView.CGImage];
    
    CIContext *context = [CIContext contextWithOptions:nil];
    
    // Apply the blur filter
    CIFilter *blurFilter = [CIFilter filterWithName:@"CIGaussianBlur"];
    [blurFilter setValue:inputImage forKey:kCIInputImageKey];
    [blurFilter setValue:radius forKey:kCIInputRadiusKey];
          
    CIImage *outputImage = [blurFilter valueForKey:kCIOutputImageKey];
          
    CGImageRef cgImage = [context createCGImage:outputImage fromRect:[outputImage extent]];
    
    // Convert the CGImageRef to UIImage
    UIImage *blurredImage = [UIImage imageWithCGImage:cgImage];
          
    // Release the CGImageRef
    CGImageRelease(cgImage);
      
    [textField setBackground: blurredImage];
    
  } else return;
}

- (void) initTextField: (UIView*)view {
    textField = [[UITextField alloc] initWithFrame:CGRectMake(0, 0, view.bounds.size.width, view.bounds.size.height)];
    textField.translatesAutoresizingMaskIntoConstraints = NO;
    
    [textField setTextAlignment:NSTextAlignmentCenter];
    [textField setSecureTextEntry: TRUE];
    [textField setUserInteractionEnabled: NO];
        
    if (![textField isDescendantOfView: view]) {
        [view addSubview: textField.superview];
        [view sendSubviewToBack: textField.superview];
    }

    [view.layer.superlayer addSublayer:textField.layer];
    
    if(textField.layer.sublayers.firstObject) {
      [textField.layer.sublayers.firstObject addSublayer:view.layer];
    }

    [textField.centerXAnchor constraintEqualToAnchor:view.centerXAnchor].active = YES;
    [textField.centerYAnchor constraintEqualToAnchor:view.centerYAnchor].active = YES;
    [textField.widthAnchor constraintEqualToAnchor:view.widthAnchor].active = YES;
    [textField.heightAnchor constraintEqualToAnchor:view.heightAnchor].active = YES;
      
}

- (void)removeScreenShot {
  if (textField != nil) {
    [textField setSecureTextEntry: FALSE];
    [textField setBackgroundColor: [UIColor clearColor]];
    [textField setBackground: nil];
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

RCT_EXPORT_METHOD(listenEvent) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  [center removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                      object:nil
                       queue:mainQueue
                  usingBlock:^(NSNotification *notification) {
    
    if (hasListeners) {
      [self emit:@"onSnapper" body:nil];
    }
  }];
}

RCT_EXPORT_METHOD(activateShield: (NSString *)screenshotBackgroundColor) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *presentedViewController = RCTPresentedViewController();
    [self secureViewWithBackgroundColor: presentedViewController.view.superview withScreenShotBackgroundColor: screenshotBackgroundColor];
  });

  [center removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                      object:nil
                       queue:mainQueue
                  usingBlock:^(NSNotification *notification) {
    
    if (hasListeners) {
      [self emit:@"onSnapper" body:nil];
    }
  }];
}

RCT_EXPORT_METHOD(activateWithoutShield) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  dispatch_async(dispatch_get_main_queue(), ^{
    [self removeScreenShot];
  });
  [center removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                      object:nil
                       queue:mainQueue
                  usingBlock:^(NSNotification *notification) {
    
    if (hasListeners) {
      [self emit:@"onSnapper" body:nil];
    }
  }];
}

RCT_EXPORT_METHOD(activateShieldWithBlurView: (nonnull NSNumber *)borderRadius) {
  NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
  NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
  dispatch_async(dispatch_get_main_queue(), ^{
    UIViewController *presentedViewController = RCTPresentedViewController();
    [self secureViewWithBlurView: presentedViewController.view.superview withBorderRadius: borderRadius];
  });

  [center removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  [center addObserverForName:UIApplicationUserDidTakeScreenshotNotification
                      object:nil
                       queue:mainQueue
                  usingBlock:^(NSNotification *notification) {
    
    if (hasListeners) {
      [self emit:@"onSnapper" body:nil];
    }
  }];
}

RCT_EXPORT_METHOD(deactivateShield) {
  dispatch_async(dispatch_get_main_queue(), ^{
    [self removeScreenShot];
  });
  [[NSNotificationCenter defaultCenter]removeObserver:UIApplicationUserDidTakeScreenshotNotification];
}

RCT_EXPORT_METHOD(removeEvent) {
  [[NSNotificationCenter defaultCenter]removeObserver:UIApplicationUserDidTakeScreenshotNotification];
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
