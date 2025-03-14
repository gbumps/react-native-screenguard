import { TurboModule, TurboModuleRegistry } from 'react-native';
import * as ScreenGuardData from './data';

export interface Spec extends TurboModule {
  activateShield: (data: ScreenGuardData.ScreenGuardColorData) => void;
  activateShieldWithoutEffect: () => void;
  activateShieldWithBlurView(
    data: ScreenGuardData.ScreenGuardBlurDataObject
  ): () => void;
  activateShieldWithImage(
    data: ScreenGuardData.ScreenGuardImageDataObject
  ): () => void;
  deactivateShield: () => void;
  registerScreenshotEventListener(
    getScreenShotPath: boolean | false,
    callback: (
      data?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null
    ) => void
  ): void;
  registerScreenRecordingEventListener(callback: (arg: any) => void): void;
}

export default TurboModuleRegistry.get<Spec>('ScreenGuard');
