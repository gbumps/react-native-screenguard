import { useEffect, useState } from 'react';
import { NativeEventEmitter } from 'react-native';
import NativeScreenGuard from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';
import { ScreenGuardScreenRecordDataObject } from './data';

export function useSGScreenRecord() {
    const [value, setValue] = useState<ScreenGuardScreenRecordDataObject | null>(null);

    useEffect(() => {
        if (!NativeScreenGuard) return;

        const screenGuardEmitter = new NativeEventEmitter(NativeScreenGuard as any);

        const subscription = screenGuardEmitter.addListener(
            ScreenGuardConstants.SCREEN_RECORDING_EVT,
            (event: ScreenGuardScreenRecordDataObject) => {
                setValue(event);
            }
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return value;
}
