#import "EventEmitter/EventEmitter.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@interface ScreenGuard : EventEmitter
- (void)register;
- (void)unregister;
- (void)activateShield;
- (void)activateWithoutShield;
- (void)deactivateShield;
@end
