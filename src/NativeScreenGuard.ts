import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  initSettings: (data: {
    enableCapture: boolean;
    enableRecord: boolean;
    enableContentMultitask: boolean;
    displayScreenGuardOverlay?: boolean;
    displayScreenguardOverlayAndroid?: boolean;
    timeAfterResume?: number;
    getScreenshotPath?: boolean;
    limitCaptureEvtCount?: number;
    trackingLog?: boolean;
  }) => Promise<void>;
  activateShield: (data: {
    backgroundColor: string;
  }) => Promise<void>;
  activateShieldWithoutEffect: () => Promise<void>;
  activateShieldWithBlurView: (data: {
    radius: number;
  }) => Promise<void>;
  activateShieldWithImage: (data: {
    source: {
      uri: string;
    };
    defaultSource: {
      uri: string;
    };
    width: number;
    height: number;
    alignment?: number;
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    backgroundColor: string;
  }) => Promise<void>;
  deactivateShield: () => Promise<void>;
  getScreenGuardLogs: (maxCount: number) => Promise<
    Array<{
      timestamp: number;
      action: string;
      isActivated: boolean;
      method: string;
    }>
  >;
  addListener: (eventName: string) => void;
  removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.get<Spec>('ScreenGuard');
