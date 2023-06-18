#import "EventEmitter/EventEmitter.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface ScreenGuard : EventEmitter
- (void)unregister;
- (void)initTextField: (UIView*_Nonnull)view;
- (void)secureViewWithBackgroundColor: (UIView*_Nonnull)view withScreenShotBackgroundColor:(NSString *_Nonnull)color;
- (void)secureViewWithBlurView: (UIView*_Nonnull)view withBorderRadius:(nonnull NSNumber *)radius;
- (void)removeScreenShot;
- (UIColor *_Nonnull)colorFromHexString:(NSString *_Nonnull)hexString;
- (UIImage *_Nonnull)convertViewToImage:(UIView *_Nonnull)view;
@end
