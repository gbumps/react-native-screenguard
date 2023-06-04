//
//  EventEmitter.h
//  react-native-screenguard
//
//  Created by gbumps on 01/04/2023.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTEventEmitter.h>

#import <React/RCTBridgeModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface EventEmitter: RCTEventEmitter<RCTBridgeModule>
- (void)emit:(NSString *)name body:(id)body;
@end

NS_ASSUME_NONNULL_END
