import { useEffect, useState, useRef } from 'react';
import { NativeEventEmitter, NativeModules, TurboModuleRegistry } from 'react-native';
import { type Spec } from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardScreenShotPathDataObject, ScreenGuardHookData } from './data';

const NativeScreenGuard = TurboModuleRegistry.get<Spec>('ScreenGuard')
    || NativeModules.ScreenGuard;

const screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard as any);

export function useSGScreenShot(
    listener?: (event: ScreenGuardScreenShotPathDataObject) => void
) {
    const [screenshotData, setScreenshotData] = useState<ScreenGuardScreenShotPathDataObject | null>(null);
    const [activationStatus, setActivationStatus] = useState<ScreenGuardHookData | null>(null);

    const listenerRef = useRef(listener);

    useEffect(() => {
        listenerRef.current = listener;
    }, [listener]);

    useEffect(() => {
        if (!NativeScreenGuard) return;


        const screenshotSubscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREENSHOT_EVT,
            (event: ScreenGuardScreenShotPathDataObject) => {
                setScreenshotData(event);
                if (listenerRef.current) {
                    listenerRef.current(event);
                }
            }
        );

        const statusSubscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREEN_GUARD_EVT,
            (event: ScreenGuardHookData) => {
                setActivationStatus(event);
            }
        );

        return () => {
            screenshotSubscription.remove();
            statusSubscription.remove();
        };
    }, []);

    return {
        screenshotData,
        activationStatus,
    };
}
