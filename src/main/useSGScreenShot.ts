import { useEffect, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import NativeScreenGuard from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardScreenShotPathDataObject } from './data';

export function useSGScreenShot() {
    const [value, setValue] = useState<ScreenGuardScreenShotPathDataObject | null>(null);

    useEffect(() => {
        if (!NativeScreenGuard) return;

        const screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard as any);

        const subscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREENSHOT_EVT,
            (event: ScreenGuardScreenShotPathDataObject | null) => {
                setValue(event);
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return value;
}
