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
- (void)showOverlay:(BOOL)persistent;
- (void)removeOverlay;

// Logging
- (void)logAction:(NSString *)action status:(BOOL)isProtected;
- (void)getScreenGuardLogs:(NSNumber *)maxCount callback:(void (^)(NSArray *logs))callback;

// Logic Helpers
- (void)registerAppLifecycleListeners;
- (void)handleAppWillResignActive;
- (void)handleAppDidBecomeActive;

@end
