import { useEffect, useState } from 'react';
import { NativeEventEmitter, NativeModules, TurboModuleRegistry } from 'react-native';
import { type Spec } from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardScreenShotPathDataObject } from './data';

const NativeScreenGuard = TurboModuleRegistry.get<Spec>('ScreenGuard')
    || NativeModules.ScreenGuard;

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
