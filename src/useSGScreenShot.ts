import { useEffect, useState, useRef } from 'react';
import { NativeEventEmitter, NativeModules, TurboModuleRegistry } from 'react-native';
import { type Spec } from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardScreenShotPathDataObject, ScreenGuardHookData } from './data';

const NativeScreenGuard = TurboModuleRegistry.get<Spec>('ScreenGuard')
    || NativeModules.ScreenGuard;

export function useSGScreenShot(
    listener?: (event: ScreenGuardScreenShotPathDataObject) => void
) {
    const [screenshotData, setScreenshotData] = useState<ScreenGuardScreenShotPathDataObject | null>(null);
    const [protectionStatus, setProtectionStatus] = useState<ScreenGuardHookData | null>(null);

    const listenerRef = useRef(listener);

    useEffect(() => {
        listenerRef.current = listener;
    }, [listener]);

    useEffect(() => {
        if (!NativeScreenGuard) return;

        const screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard as any);

        const screenshotSubscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREENSHOT_EVT,
            (event: ScreenGuardScreenShotPathDataObject) => {
                setScreenshotData(event);
                if (listenerRef.current) {
                    listenerRef.current(event);
                }
            }
        );

        const protectionSubscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREEN_GUARD_EVT,
            (event: ScreenGuardHookData) => {
                setProtectionStatus(event);
            }
        );

        return () => {
            screenshotSubscription.remove();
            protectionSubscription.remove();
        };
    }, []);

    return {
        screenshotData,
        protectionStatus,
    };
}
