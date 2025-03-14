import { TurboModule, TurboModuleRegistry } from 'react-native';
import * as ScreenGuardData from './data';

export interface Spec extends TurboModule {
  register: (color: string) => void;
  registerWithoutEffect: () => void;
  registerWithBlurView(
    data: ScreenGuardData.ScreenGuardBlurDataObject
  ): () => void;
  registerWithImage(
    data: ScreenGuardData.ScreenGuardImageDataObject
  ): () => void;
  unregister: () => void;
  registerScreenshotEventListener(
    getScreenShotPath: boolean | false,
    callback: (
      data?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null
    ) => void
  ): void;
  registerScreenRecordingEventListener(callback: (arg: any) => void): void;
}

export default TurboModuleRegistry.get<Spec>('ScreenGuard');
