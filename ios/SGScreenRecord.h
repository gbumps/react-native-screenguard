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
#endif

#if RCT_NEW_ARCH_ENABLED
#import "SGScreenRecordSpec.h"
#endif


#if RCT_NEW_ARCH_ENABLED
@interface SGScreenRecord: EventEmitter <NativeSGScreenRecordSpec>
@end
#else
@interface SGScreenRecord: EventEmitter <RCTBridgeModule>

@end
#endif
