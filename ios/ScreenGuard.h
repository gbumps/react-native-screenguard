#import <Foundation/Foundation.h>
#import <React/RCTUtils.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTComponent.h>
#import <React/RCTUIManager.h>
#import <React/RCTConvert.h>
#import <React/RCTInvalidating.h>

#if __has_include(<React/RCTBridgeModule.h>)
#import <React/RCTBridgeModule.h>
#elif __has_include("RCTBridgeModule.h")
#endif

#if RCT_NEW_ARCH_ENABLED
#import "ScreenGuardSpec.h"
#endif


#if RCT_NEW_ARCH_ENABLED
@interface ScreenGuard: RCTEventEmitter <NativeScreenGuardSpec, RCTInvalidating>
@property (nonatomic, strong, readonly) NSDictionary *config;
@end
#else
@interface ScreenGuard : RCTEventEmitter <RCTBridgeModule, RCTInvalidating>
@property (nonatomic, strong, readonly) NSDictionary *config;
+ (instancetype) shared;
- (void)configureWithParams: (NSDictionary *)params;
@end
#endif
