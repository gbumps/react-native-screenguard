import { useEffect, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import NativeScreenGuard from './NativeScreenGuard';

const NativeScreenGuard = TurboModuleRegistry.get('ScreenGuard');

import * as ScreenGuardConstants from './constant';

var screenGuardEmitter = null;
var screenGuardSubscription = null;

export function useScreenGuard() {
    const [value, setValue] = useState(null);
    useEffect(() => {
        if (!NativeScreenGuard)
            return;
        screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard);
        screenGuardSubscription = screenGuardEmitter.addListener(ScreenGuardConstants.SCREEN_GUARD_EVT, (event) => {
            setValue(event);
        });
        return () => {
            screenGuardSubscription.remove();
        };
    }, []);
    return value;
}
