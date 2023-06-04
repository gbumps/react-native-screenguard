//
//  EventEmitter.m
//
//
//  Created by gbumps on 27/05/2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import "EventEmitter.h"

@implementation EventEmitter

RCT_EXPORT_MODULE();

-(NSArray<NSString *> *)supportedEvents {
  return @[];
}

- (void)emit:(NSString *)name body:(id)body {
  if(self.bridge != nil) {
    [super sendEventWithName:name body:body];
  }
}

@end
