#import "EventEmitter/EventEmitter.h"
#import <Foundation/Foundation.h>
#import <React/RCTUtils.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTComponent.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import "React/RCTBridgeModule.h"
#endif

#if RCT_NEW_ARCH_ENABLED
#import "ScreenGuardSpec.h"
#endif


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

NSString* _Nullable NSStringFromAlignment(ScreenGuardImageAlignment alignment);

@interface ScreenGuard : EventEmitter
- (void)secureViewWithBackgroundColor: (NSString *_Nonnull)color;
- (void)secureViewWithBlurView: (nonnull NSNumber *)radius;
- (void)secureViewWithImage: (nonnull NSDictionary *) source
          withDefaultSource: (nullable NSDictionary *) defaultSource
                  withWidth: (nonnull NSNumber *) width
                 withHeight: (nonnull NSNumber *) height
              withAlignment: (ScreenGuardImageAlignment) alignment
        withBackgroundColor: (nonnull NSString *) backgroundColor;
- (void)removeScreenShot;
- (UIColor *_Nonnull)colorFromHexString:(NSString *_Nonnull)hexString;
- (UIImage *_Nonnull)convertViewToImage:(UIView *_Nonnull)view;
@end

#if RCT_NEW_ARCH_ENABLED
@interface ScreenGuard() <NativeScreenguardSpec, RCTBridgeModule>
@end
#endif