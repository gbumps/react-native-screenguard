import { useEffect, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import NativeScreenGuard from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardHookData } from './data';

export function useScreenGuard() {
    const [value, setValue] = useState<ScreenGuardHookData | null>(null);

    useEffect(() => {
        if (!NativeScreenGuard) return;

        const screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard as any);

        const subscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREEN_GUARD_EVT,
            (event: ScreenGuardHookData) => {
                setValue(event);
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return value;
}
