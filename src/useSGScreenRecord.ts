import { useEffect, useState, useRef } from 'react';
import { NativeEventEmitter, NativeModules, TurboModuleRegistry } from 'react-native';
import { type Spec } from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardScreenRecordDataObject, ScreenGuardHookData } from './data';

const NativeScreenGuard = TurboModuleRegistry.get<Spec>('ScreenGuard')
    || NativeModules.ScreenGuard;

const screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard as any);

export function useSGScreenRecord(
    listener?: (event: ScreenGuardScreenRecordDataObject) => void
) {
    const [recordingData, setRecordingData] = useState<ScreenGuardScreenRecordDataObject | null>(null);
    const [activationStatus, setActivationStatus] = useState<ScreenGuardHookData | null>(null);

    const listenerRef = useRef(listener);

    useEffect(() => {
        listenerRef.current = listener;
    }, [listener]);

    useEffect(() => {
        if (!NativeScreenGuard) return;

        const recordingSubscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREEN_RECORDING_EVT,
            (event: ScreenGuardScreenRecordDataObject) => {
                setRecordingData(event);
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
            recordingSubscription.remove();
            statusSubscription.remove();
        };
    }, []);

    return {
        recordingData,
        activationStatus,
    };
}
