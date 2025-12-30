#import "ScreenGuard.h"
#import "ScreenGuardImpl.h"
#import "ScreenGuardConstants.h"
#import <React/RCTRootView.h>
#import <React/RCTComponent.h>
#import <React/RCTImageLoader.h>

@implementation ScreenGuard
RCT_EXPORT_MODULE(ScreenGuard)

+ (instancetype)shared {
  static ScreenGuard *s;
  static dispatch_once_t once;
  dispatch_once(&once, ^{ s = [ScreenGuard new]; });
  return s;
}

- (void)startObserving {
    [[ScreenGuardImpl shared] setEventEmitter:self];
}

- (void)stopObserving {
    [[ScreenGuardImpl shared] setEventEmitter:nil];
}

- (void)invalidate {
    [super invalidate];
    [[ScreenGuardImpl shared] reset];
    [[ScreenGuardImpl shared] setEventEmitter:nil];
}

- (NSArray<NSString *> *)supportedEvents {
    return @[
        @"onScreenGuardEvt",
        @"onScreenShotCaptured",
        @"onScreenRecordingCaptured"
    ];
}

- (void)configureWithParams:(NSDictionary *)params {
    [[ScreenGuardImpl shared] configureWithParams:params];
}

//old architecture entry point
#if !RCT_NEW_ARCH_ENABLED
RCT_EXPORT_METHOD(initSettings:(NSDictionary *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (![params isKindOfClass:[NSDictionary class]]) {
    reject(kSGErrorInvalidParams, @"params must be an object", nil);
    return;
  }
  [[ScreenGuardImpl shared] configureWithParams:params];
  resolve(@(YES));
}

RCT_EXPORT_METHOD(activateShield: (nonnull NSDictionary *) data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    NSString *screenshotBackgroundColor = data[@"backgroundColor"];
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[ScreenGuardImpl shared] secureViewWithBackgroundColor:screenshotBackgroundColor];
            resolve(nil);
        } @catch (NSException *e) {
            NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
            reject(kSGErrorActivateShield, e.reason, error);
        }
    
    });
}


RCT_EXPORT_METHOD(activateShieldWithBlurView: (nonnull NSDictionary *) data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    NSNumber *borderRadius = data[@"radius"];
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            [[ScreenGuardImpl shared] secureViewWithBlurView: borderRadius];
            resolve(nil);
        } @catch (NSException *e) {
            NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
            reject(kSGErrorActivateShieldBlur, e.reason, error);
        }
    });
}

RCT_EXPORT_METHOD(activateShieldWithImage: (nonnull NSDictionary *)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    if (![data isKindOfClass:[NSDictionary class]]) {
        return;
    }
    
    NSDictionary *source = data[@"source"];
    NSDictionary *defaultSource = data[@"defaultSource"];
    NSNumber *width = data[@"width"];
    NSNumber *height = data[@"height"];
    NSString *backgroundColor = data[@"backgroundColor"];
    NSNumber *alignment = data[@"alignment"];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        if (alignment != nil) {
            NSInteger alignVal = [data[@"alignment"] integerValue];
            ScreenGuardImageAlignment dataAlignment = (ScreenGuardImageAlignment)alignVal;
            [[ScreenGuardImpl shared] secureViewWithImageAlignment:source withDefaultSource:defaultSource withWidth:width withHeight:height withAlignment:dataAlignment withBackgroundColor:backgroundColor];
        } else {
            NSNumber *top = data[@"top"];
            NSNumber *left = data[@"left"];
            NSNumber *bottom = data[@"bottom"];
            NSNumber *right = data[@"right"];
            [[ScreenGuardImpl shared] secureViewWithImagePosition:source withDefaultSource:defaultSource withWidth:width withHeight:height withTop:top withLeft:left withBottom:bottom withRight:right withBackgroundColor:backgroundColor];
        }
    });
    resolve(nil);
}

RCT_EXPORT_METHOD(activateShieldPartially: (nonnull NSDictionary *) data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    NSNumber *reactTag = data[@"reactTag"];
    NSString *backgroundColor = data[@"backgroundColor"];
    
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            UIView *view = [self.bridge.uiManager viewForReactTag:reactTag];
            if (view == nil) {
                 reject(kSGErrorInvalidParams, @"Cannot find view for the provided reactTag", nil);
                 return;
            }
             [[ScreenGuardImpl shared] secureViewPartially:view withBackgroundColor:backgroundColor];
            resolve(nil);
        } @catch (NSException *e) {
             NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
            reject(kSGErrorActivateShield, e.reason, error);
        }
    });
}

RCT_EXPORT_METHOD(deactivateShield: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
        @try {
            [[ScreenGuardImpl shared] removeScreenShot];
            resolve(nil);
        } @catch (NSException *e) {
            NSError *error = [NSError errorWithDomain:@"ScreenGuard" code: -1 userInfo:nil];
            reject(@"deactivateShield", e.reason, error);
        }
}

RCT_EXPORT_METHOD(activateShieldWithoutEffect: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    NSString *s = @"This function is for Android only, please use register, registerWithBlurView, registerWithImageInstead!";
    RCTLogWarn(@"%@", s);
    NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
    reject(kSGErrorActivateShieldNoEffect, s, error);
}

RCT_EXPORT_METHOD(getScreenGuardLogs: (nonnull NSNumber *)maxCount resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject) {
    [[ScreenGuardImpl shared] getScreenGuardLogs:maxCount callback:^(NSArray *logs) {
        resolve(logs);
    }];
}

#endif

//New Architecture entry point
#ifdef RCT_NEW_ARCH_ENABLED
- (void)initSettings:(JS::NativeScreenGuard::SpecInitSettingsData &)data
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject
{
    NSDictionary *params = @{
        kSGConfigEnableCapture: @(data.enableCapture()),
        kSGConfigEnableRecord: @(data.enableRecord()),
        kSGConfigEnableMultitask: @(data.enableContentMultitask()),
        kSGConfigDisplayScreenGuardOverlay: @(data.displayScreenGuardOverlay().has_value() ? data.displayScreenGuardOverlay().value() : NO),
        kSGConfigTimeAfterResume: @(data.timeAfterResume().has_value() ? data.timeAfterResume().value() : 1000),
        kSGConfigGetScreenshotPath: @(data.getScreenshotPath().has_value() ? data.getScreenshotPath().value() : NO),
        kSGConfigLimitCaptureEvtCount: @(data.limitCaptureEvtCount().has_value() ? data.limitCaptureEvtCount().value() : 0),
        kSGConfigTrackingLog: @(data.trackingLog().has_value() ? data.trackingLog().value() : NO)
    };
  [[ScreenGuardImpl shared] configureWithParams:params];
  resolve(@(YES));
}

- (void)activateShieldWithoutEffect: (RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSString *s = @"This function is for Android only, please use register, registerWithBlurView, registerWithImageInstead!";
    RCTLogWarn(@"%@", s);
    NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
    reject(kSGErrorActivateShieldNoEffect, s, error);
}

- (void)activateShield:(JS::NativeScreenGuard::SpecActivateShieldData &)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
        NSString *screenshotBackgroundColor = data.backgroundColor();
        dispatch_async(dispatch_get_main_queue(), ^{
            @try {
                [[ScreenGuardImpl shared] secureViewWithBackgroundColor:screenshotBackgroundColor];
                resolve(nil);
            } @catch (NSException *e) {
                NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
                reject(kSGErrorActivateShield, e.reason, error);
            }
        
        });
}

- (void)activateShieldWithBlurView:(JS::NativeScreenGuard::SpecActivateShieldWithBlurViewData &)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
        NSNumber *borderRadius = [NSNumber numberWithDouble: data.radius()];
        dispatch_async(dispatch_get_main_queue(), ^{
            @try {
                [[ScreenGuardImpl shared] secureViewWithBlurView: borderRadius];
                resolve(nil);
            } @catch (NSException *e) {
                NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
                reject(kSGErrorActivateShieldBlur, e.reason, error);
            }
        });
}

- (void)activateShieldWithImage:(JS::NativeScreenGuard::SpecActivateShieldWithImageData &)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    @try {
        NSDictionary *source = [[NSDictionary alloc] initWithObjectsAndKeys: data.source().uri(), @"uri", nil];
        NSDictionary *defaultSource = [[NSDictionary alloc] initWithObjectsAndKeys: data.defaultSource().uri(), @"uri", nil];
        NSNumber *width = [NSNumber numberWithDouble: data.width()];
        NSNumber *height = [NSNumber numberWithDouble: data.height()];
        NSString *backgroundColor = data.backgroundColor();
        if (data.alignment().has_value()) {
            NSInteger alignment = [[NSNumber numberWithDouble: data.alignment().value()] integerValue];
            ScreenGuardImageAlignment dataAlignment = (ScreenGuardImageAlignment)alignment;
            dispatch_async(dispatch_get_main_queue(), ^{
                [[ScreenGuardImpl shared] secureViewWithImageAlignment:source withDefaultSource:defaultSource withWidth:width withHeight:height withAlignment:dataAlignment withBackgroundColor:backgroundColor];
            });
        } else {
            NSNumber *top = nil;
            NSNumber *left = nil;
            NSNumber *bottom = nil;
            NSNumber *right = nil;
            if (data.top().has_value()) {
                top = [NSNumber numberWithDouble: data.top().value()];
            }
            if (data.left().has_value()) {
                left = [NSNumber numberWithDouble: data.left().value()];
            }
            if (data.bottom().has_value()) {
                bottom = [NSNumber numberWithDouble: data.bottom().value()];
            }
            if (data.right().has_value()) {
                right = [NSNumber numberWithDouble: data.right().value()];
            }
    
            dispatch_async(dispatch_get_main_queue(), ^{
                [[ScreenGuardImpl shared] secureViewWithImagePosition:source withDefaultSource:defaultSource withWidth:width withHeight:height withTop:top withLeft:left withBottom:bottom withRight:right withBackgroundColor:backgroundColor];
            });
        }
        resolve(nil);
    } @catch (NSException *e) {
        NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
        reject(kSGErrorActivateShieldImage, e.reason, error);
    }
        
}

- (void)activateShieldPartially:(JS::NativeScreenGuard::SpecActivateShieldPartiallyData &)data resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    NSNumber *reactTag = [NSNumber numberWithDouble: data.reactTag()];
    NSString *backgroundColor = data.backgroundColor();
    
    dispatch_async(dispatch_get_main_queue(), ^{
        @try {
            UIView *view = [self.bridge.uiManager viewForReactTag:reactTag];
            if (view == nil) {
                 reject(kSGErrorInvalidParams, @"Cannot find view for the provided reactTag", nil);
                 return;
            }
             [[ScreenGuardImpl shared] secureViewPartially:view withBackgroundColor:backgroundColor];
            resolve(nil);
        } @catch (NSException *e) {
             NSError *error = [NSError errorWithDomain:kSGErrorDomain code: -1 userInfo:nil];
            reject(kSGErrorActivateShield, e.reason, error);
        }
    });
}

- (void)deactivateShield:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
        @try {
            [[ScreenGuardImpl shared] removeScreenShot];
            resolve(nil);
        } @catch (NSException *e) {
            NSError *error = [NSError errorWithDomain:@"ScreenGuard" code: -1 userInfo:nil];
            reject(@"deactivateShield", e.reason, error);
        }
}

- (void)getScreenGuardLogs:(double)maxCount resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject {
    [[ScreenGuardImpl shared] getScreenGuardLogs:@(maxCount) callback:^(NSArray *logs) {
        resolve(logs);
    }];
}


- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeScreenGuardSpecJSI>(params);
}
#endif


@end
