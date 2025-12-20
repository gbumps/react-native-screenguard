import { useEffect, useState } from 'react';
import { NativeEventEmitter } from 'react-native';

import NativeScreenGuard from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';

var screenGuardEmitter: NativeEventEmitter | null = null;

var screenGuardSubscription: any = null;

export function useScreenGuard() {
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    if (!NativeScreenGuard) return;

    screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard);

    screenGuardSubscription = screenGuardEmitter.addListener(
      ScreenGuardConstants.SCREEN_GUARD_EVT,
      (event: any) => {
        setValue(event);
      }
    );

    return () => {
      screenGuardSubscription.remove();
    };
  }, []);

  return value;
}
