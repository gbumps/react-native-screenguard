import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  registerScreenshotEventListener: (getScreenshotPath: boolean) => void;
  removeScreenshotEventListener: () => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>('SGScreenshot');
