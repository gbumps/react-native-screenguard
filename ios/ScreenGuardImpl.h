#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

typedef NS_ENUM(NSInteger, ScreenGuardImageAlignment) {
    AlignmentTopLeft,
    AlignmentTopCenter,
    AlignmentTopRight,
    AlignmentCenterLeft,
    AlignmentCenter,
    AlignmentCenterRight,
    AlignmentBottomLeft,
    AlignmentBottomCenter,
    AlignmentBottomRight
};

@interface ScreenGuardImpl : NSObject

+ (instancetype)shared;

- (void)configureWithParams:(NSDictionary *)params;

- (void)secureViewWithBackgroundColor:(NSString *)color;

- (void)secureViewPartially:(UIView *)view withBackgroundColor:(NSString *)color;

- (void)secureViewWithBlurView:(NSNumber *)radius;

- (void)secureViewWithImageAlignment:(NSDictionary *)source
                   withDefaultSource:(NSDictionary *)defaultSource
                           withWidth:(NSNumber *)width
                          withHeight:(NSNumber *)height
                       withAlignment:(ScreenGuardImageAlignment)alignment
                 withBackgroundColor:(NSString *)backgroundColor;

- (void)secureViewWithImagePosition:(NSDictionary *)source
                  withDefaultSource:(NSDictionary *)defaultSource
                          withWidth:(NSNumber *)width
                         withHeight:(NSNumber *)height
                            withTop:(NSNumber *)top
                           withLeft:(NSNumber *)left
                         withBottom:(NSNumber *)bottom
                          withRight:(NSNumber *)right
                withBackgroundColor:(NSString *)backgroundColor;

- (void)removeScreenShot;

- (void)registerScreenshotEventListener:(BOOL)getScreenshotPath;
- (void)removeScreenshotEventListener;

- (void)registerScreenRecordingEventListener:(BOOL)getRecordingStatus;
- (void)removeScreenRecordingEventListener;


- (void)reset;

- (void)setEventEmitter:(RCTEventEmitter *)emitter;

// Logic
- (void)applySecureState;
- (void)initSettings:(BOOL)enableCapture enableRecord:(BOOL)enableRecord enableContentMultitask:(BOOL)enableContentMultitask displayScreenGuardOverlay:(BOOL)displayScreenGuardOverlay timeAfterResume:(NSTimeInterval)timeAfterResume limitCaptureEvtCount:(NSNumber *)limitCaptureEvtCount getScreenshotPath:(BOOL)getScreenshotPath allowBackpress:(BOOL)allowBackpress trackingLog:(BOOL)trackingLog;
- (void)handleAppWillResignActive;
- (void)handleAppDidBecomeActive;

// Logging
- (void)logAction:(NSString *)action status:(BOOL)isProtected;
- (void)getScreenGuardLogs:(NSNumber *)maxCount callback:(void (^)(NSArray *logs))callback;

// Logic Helpers
- (void)registerAppLifecycleListeners;
- (void)handleAppWillResignActive;
- (void)handleAppDidBecomeActive;

@end
