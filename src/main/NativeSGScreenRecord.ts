import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  registerScreenRecordingEventListener: (
    getScreenRecordStatus: boolean
  ) => void;
  removeScreenRecordingEventListener: () => void;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>('SGScreenRecord');
