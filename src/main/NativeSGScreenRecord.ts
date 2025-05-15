import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  registerScreenRecordingEventListener: (
    getScreenRecordStatus: boolean
  ) => void;
  removeScreenRecordingEventListener: () => void;
}

export default TurboModuleRegistry.get<Spec>('SGScreenRecord');
