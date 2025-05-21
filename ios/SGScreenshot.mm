#import "SGScreenshot.h"
#import <React/RCTRootView.h>
#import <React/RCTComponent.h>
#import <React/RCTImageLoader.h>

NSString * const SCREENSHOT_EVT = @"onScreenShotCaptured";

static BOOL getScreenShotPath;

@implementation SGScreenshot
RCT_EXPORT_MODULE(SGScreenshot)

static bool hasListeners = NO;

- (NSArray<NSString *> *)supportedEvents {
    return @[SCREENSHOT_EVT];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (UIImage *)convertViewToImage:(UIView *)view {
    UIGraphicsBeginImageContextWithOptions(view.bounds.size, view.opaque, 0.0);
    [view.layer renderInContext:UIGraphicsGetCurrentContext()];
    UIImage *image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    return image;
}


- (void)handleScreenshotNotification:(NSNotification *)notification {
    if (hasListeners && getScreenShotPath) {
        UIViewController *presentedViewController = RCTPresentedViewController();
        UIImage *image = [self convertViewToImage:presentedViewController.view.superview];
        NSData *data = UIImagePNGRepresentation(image);
        if (!data) {
            [self emit:SCREENSHOT_EVT body:nil];
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
        [self emit:SCREENSHOT_EVT body:result];
    } else if (hasListeners) {
        [self emit:SCREENSHOT_EVT body:nil];
    }
}

//old architecture entry point
#if !RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(registerScreenshotEventListener: (BOOL)getScreenshotPath) {
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: UIApplicationUserDidTakeScreenshotNotification
                                                  object: nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleScreenshotNotification:)
                                                 name:UIApplicationUserDidTakeScreenshotNotification
                                               object:nil];
    getScreenShotPath = getScreenshotPath;
    
}

RCT_EXPORT_METHOD(removeScreenshotEventListener) {
    [[NSNotificationCenter defaultCenter] removeObserver: self
                                                    name: UIApplicationUserDidTakeScreenshotNotification
                                                  object: nil];
}

#endif

//New Architecture entry point
#ifdef RCT_NEW_ARCH_ENABLED
- (void)registerScreenshotEventListener: (BOOL)getScreenshotPath {
        [[NSNotificationCenter defaultCenter] removeObserver: self
                                                        name: UIApplicationUserDidTakeScreenshotNotification
                                                      object: nil];
        
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(handleScreenshotNotification:)
                                                     name:UIApplicationUserDidTakeScreenshotNotification
                                                   object:nil];
        getScreenShotPath = getScreenshotPath;
}

- (void)removeScreenshotEventListener { 
   [[NSNotificationCenter defaultCenter] removeObserver: self
                                                        name: UIApplicationUserDidTakeScreenshotNotification
                                                      object: nil]; 
}

#endif


// // Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSGScreenshotSpecJSI>(params);
}
#endif


@end
