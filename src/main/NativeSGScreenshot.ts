import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  registerScreenshotEventListener: (getScreenshotPath: boolean) => void;
  removeScreenshotEventListener: () => void;
}

export default TurboModuleRegistry.get<Spec>('SGScreenshot');
