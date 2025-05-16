//
//  ScreenRecordEvent.m
//  Pods
//
//  Created by gbumps on 14/5/25.
//

#import "SGScreenRecord.h"

NSString * const SCREEN_RECORDING_EVT = @"onScreenRecordingCaptured";

@implementation SGScreenRecord
RCT_EXPORT_MODULE(SGScreenRecord)

bool hasListeners;
static BOOL getScreenRecordingStatus;

- (NSArray<NSString *> *)supportedEvents {
    return @[SCREEN_RECORDING_EVT];
}

- (void)startObserving {
    hasListeners = YES;
}

- (void)stopObserving {
    hasListeners = NO;
}

- (void)handleScreenRecordNotification:(NSNotification *)notification {
    BOOL isCaptured = [[UIScreen mainScreen] isCaptured];
    NSDictionary *result;
    if (isCaptured) {
       if (hasListeners && getScreenRecordingStatus) {
           result = @{@"isRecording": @"true"};
           [self emit:SCREEN_RECORDING_EVT body: result];
       } else {
           [self emit:SCREEN_RECORDING_EVT body: nil];
       }
     } else {
           if (hasListeners && getScreenRecordingStatus) {
               result = @{@"isRecording": @"false"};
               [self emit:SCREEN_RECORDING_EVT body: result];
           } else {
               [self emit:SCREEN_RECORDING_EVT body: nil];
           }
      }
}

//old architecture entry point
#if !RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(registerScreenRecordingEventListener: (BOOL)getRecordingStatus) {
        @try {
            [[NSNotificationCenter defaultCenter] removeObserver: self
                                                            name: UIScreenCapturedDidChangeNotification
                                                          object: nil];
            
            [[NSNotificationCenter defaultCenter] addObserver:self
                                                     selector:@selector(handleScreenRecordNotification:)
                                                         name:UIScreenCapturedDidChangeNotification
                                                       object:nil];
            getScreenRecordingStatus = getRecordingStatus;
        } @catch (NSException *e) {
            NSError *error = [NSError errorWithDomain:@"ScreenGuard" code: -1 userInfo:nil];
        }
}
#endif

//New Architecture entry point
#ifdef RCT_NEW_ARCH_ENABLED
- (void)registerScreenRecordingEventListener: (BOOL)getRecordingStatus {
        @try {
            [[NSNotificationCenter defaultCenter] removeObserver: self
                                                            name: UIScreenCapturedDidChangeNotification
                                                          object: nil];

            [[NSNotificationCenter defaultCenter] addObserver:self
                                                     selector:@selector(handleScreenRecordNotification:)
                                                         name:UIScreenCapturedDidChangeNotification
                                                       object:nil];
        } @catch (NSException *e) {
            NSError *error = [NSError errorWithDomain:@"ScreenGuard" code: -1 userInfo:nil];
        }
        getScreenRecordingStatus = getRecordingStatus;
}
#endif



// // Don't compile this code when we build for the old architecture.
#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeSGScreenRecordSpecJSI>(params);
}
#endif


@end
