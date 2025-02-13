import type { TurboModule } from 'react-native/Libraries/TurboModule/RCTExport';
import * as ScreenGuardData from './data';
export interface Spec extends TurboModule {
    register(data: ScreenGuardData.ScreenGuardColorData): void;
    registerWithoutEffect(): void;
    registerWithBlurView(data: ScreenGuardData.ScreenGuardBlurDataObject): void;
    registerWithImage(data: ScreenGuardData.ScreenGuardImageDataObject): void;
    unregister(): void;
    registerScreenshotEventListener(getScreenShotPath: boolean | undefined, callback: (data?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null | undefined) => void): void;
    registerScreenRecordingEventListener(callback: (arg: any) => void): void;
}
declare const _default: Spec;
export default _default;
