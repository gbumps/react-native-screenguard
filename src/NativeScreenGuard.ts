import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  initSettings: (data: {
    enableCapture: boolean;
    enableRecord: boolean;
    enableContentMultitask: boolean;
    displayScreenGuardOverlay?: boolean;
    timeAfterResume?: number;
    getScreenshotPath?: boolean;
    limitCaptureEvtCount?: number;
    trackingLog?: boolean;
    allowBackpress?: boolean;
  }) => Promise<void>;
  activateShield: (data: {
    backgroundColor: string;
    timeAfterResume?: number;
  }) => Promise<void>;
  activateShieldWithoutEffect: () => Promise<void>;
  activateShieldWithBlurView: (data: {
    radius: number;
    timeAfterResume?: number;
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
    timeAfterResume?: number;
  }) => Promise<void>;
  activateShieldPartially: (data: {
    reactTag: number;
    backgroundColor: string;
    timeAfterResume?: number;
  }) => Promise<void>;
  deactivateShield: () => Promise<void>;
  getScreenGuardLogs: (maxCount: number) => Promise<
    Array<{
      timestamp: number;
      action: string;
      isProtected: boolean;
      method: string;
    }>
  >;
}

export default TurboModuleRegistry.get<Spec>('ScreenGuard');
