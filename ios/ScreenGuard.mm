#import "ScreenGuard.h"


@implementation ScreenGuard
RCT_EXPORT_MODULE(ScreenGuard)

bool hasListeners;
static UITextField *textField;

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onSnapper"];
}

- (void)startObserving {
  hasListeners = YES;
}

- (void)stopObserving {
  hasListeners = NO;
}

- (void)secureView: (UIView*)view screenShotBackgroundColor:(NSString *)screenshotColor {
  if (@available(iOS 13.0, *)) {
    if (textField != nil) {
      //for case textField that has already been added
      [textField setSecureTextEntry: TRUE];
        [textField setBackgroundColor: [self colorFromHexString: screenshotColor]];
      
      return;
    }
  
    if (textField == nil) {
      textField = [[UITextField alloc] initWithFrame:CGRectMake(0, 0, view.bounds.size.width, view.bounds.size.height)];
        textField.translatesAutoresizingMaskIntoConstraints = NO;
      [textField setTextAlignment:NSTextAlignmentCenter];
      
    }
    
    [textField setSecureTextEntry: TRUE];
  
    [textField setUserInteractionEnabled: NO];
    [view addSubview:textField];
    
    [view sendSubviewToBack:textField];
  
    [textField.centerXAnchor constraintEqualToAnchor:view.centerXAnchor].active = YES;
    [textField.centerYAnchor constraintEqualToAnchor:view.centerYAnchor].active = YES;
    [textField.widthAnchor constraintEqualToAnchor:view.widthAnchor].active = YES;
    [textField.heightAnchor constraintEqualToAnchor:view.heightAnchor].active = YES;
    
    
    [view.layer.superlayer addSublayer:textField.layer];
    if(textField.layer.sublayers.firstObject) {
      [textField.layer.sublayers.firstObject addSublayer:view.layer];
    }
  } else return;
}

- (void)removeScreenShot {
  if (textField.superview != nil) {
    [textField setSecureTextEntry: FALSE];
      
  }
}

- (UIColor *)colorFromHexString:(NSString *)hexString {
    unsigned rgbValue = 0;
    NSScanner *scanner = [NSScanner scannerWithString:hexString];
    [scanner setScanLocation:1]; // bypass '#' character
    [scanner scanHexInt:&rgbValue];
    return [UIColor colorWithRed:((rgbValue & 0xFF0000) >> 16)/255.0 green:((rgbValue & 0xFF00) >> 8)/255.0 blue:(rgbValue & 0xFF)/255.0 alpha:1.0];
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
    [self secureView: presentedViewController.view.superview screenShotBackgroundColor: screenshotBackgroundColor];
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
  if (hasListeners) {
    dispatch_async(dispatch_get_main_queue(), ^{
      [self removeScreenShot];
    });
    [[NSNotificationCenter defaultCenter]removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  }
}

RCT_EXPORT_METHOD(removeEvent) {
  if (hasListeners) {
    [[NSNotificationCenter defaultCenter]removeObserver:UIApplicationUserDidTakeScreenshotNotification];
  }
}

@end
// Example method
// See // https://reactnative.dev/docs/native-modules-ios
// RCT_REMAP_METHOD(multiply,
//                  multiplyWithA:(double)a withB:(double)b
//                  withResolver:(RCTPromiseResolveBlock)resolve
//                  withRejecter:(RCTPromiseRejectBlock)reject)
// {
//     NSNumber *result = @(a * b);

//     resolve(result);
// }

// // Don't compile this code when we build for the old architecture.
// #ifdef RCT_NEW_ARCH_ENABLED
// - (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
//     (const facebook::react::ObjCTurboModule::InitParams &)params
// {
//     return std::make_shared<facebook::react::NativeScreenguardSpecJSI>(params);
// }
// #endif
