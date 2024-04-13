/* eslint-disable @typescript-eslint/no-unused-vars */
import { NativeModules, NativeEventEmitter } from 'react-native';
import { ScreenGuardBlurDataObject, ScreenGuardImageDataObject, ScreenGuardScreenShotPathDataObject } from './data';

import * as ScreenGuardConstants from './constant';
import { Platform } from 'react-native';

const { ScreenGuard } = NativeModules;

var screenShotEmitter: NativeEventEmitter | null = null;

var screenRecordingEmitter: NativeEventEmitter | null = null;

export default {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * @param capturedBackgroundColor background color layout after taking a screenshot
   * @version v0.0.2+
   */
  register(capturedBackgroundColor: String | null) {
    let currentColor =
      capturedBackgroundColor == null ||
      capturedBackgroundColor.trim().length === 0 ||
      !capturedBackgroundColor.trim().startsWith('#') ||
      ScreenGuardConstants.REGEX.test(
        capturedBackgroundColor.trim().substring(1)
      )
        ? ScreenGuardConstants.BLACK_COLOR
        : capturedBackgroundColor;
    ScreenGuard.activateShield(currentColor);
  },

  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 6+)
   * @param data ScreenGuardBlurDataObject data object
   * @version v1.0.2-beta+
   */
  registerWithBlurView(data: ScreenGuardBlurDataObject) {
    console.warn(
      'Install the beta version to continue. Head over to README.md -> Install -> Beta section for how to install'
    );
  },

  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
   * For screenshot detector only, this will fit your need.
   * @deprecated this function is deprecated and will be removed at least from ver 0.4.0+ or in the near future
   * consider using registerScreenRecordingEventListener and registerScreenshotEventListener instead
   * @param void callback callback after a screenshot or a video screen capture has been taken
   * @version v0.0.6+
   */
  registerWithoutScreenguard(callback: (arg: any) => void) {
    console.warn(
      'This function is deprecated and will be removed at least from ver 0.4.0+',
      'consider switching to registerScreenshotEventListener or registerScreenRecordingEventListener instead'
    );
    ScreenGuard.activateWithoutShield();
    if (screenShotEmitter == null) {
      screenShotEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res: any) => {
      callback(res);
    };
    const listenerCount = screenShotEmitter.listenerCount(
      ScreenGuardConstants.SCREENSHOT_EVT
    );
    if (!listenerCount) {
      screenShotEmitter.addListener(
        ScreenGuardConstants.SCREENSHOT_EVT,
        _callback
      );
    }
  },

  /**
   * activate with an Image uri (iOS 13+, Android 8+)
   * @param data ScreenGuardImageDataObject data object,
   * @version v1.0.2-beta+
   */
  registerWithImage(
    data: ScreenGuardImageDataObject,
  ) {
    console.warn(
      'Install the beta version to continue. Head over to README.md -> Install -> Beta section for how to install'
    );
  },

  /**
   * Deactivate screenguard
   * Clear all screen protector and event listening
   * @version v0.0.2+
   */
  unregister() {
    ScreenGuard.deactivateShield();
    if (screenShotEmitter != null) {
      screenShotEmitter.removeAllListeners(ScreenGuardConstants.SCREENSHOT_EVT);
      screenShotEmitter = null;
    }
    if (screenRecordingEmitter != null) {
      screenRecordingEmitter.removeAllListeners(
        ScreenGuardConstants.SCREEN_RECORDING_EVT
      );
      screenRecordingEmitter = null;
    }
  },

  /**
   * Screenshot event listener
   * Register for screenshot event listener
   * @param getScreenShotPath if true, callback will return a ScreenGuardScreenShotPathDataObject containing info of an image after captured, null otherwise. Default = false
   * @param callback callback after a screenshot has been triggered.
   * @version v0.3.6+
   */
  registerScreenshotEventListener(
    getScreenShotPath: boolean = false, 
    callback: (arg?: ScreenGuardScreenShotPathDataObject | null) => void
  ) {
    ScreenGuard.registerScreenShotEventListener(getScreenShotPath);
    if (screenShotEmitter == null) {
      screenShotEmitter = new NativeEventEmitter(ScreenGuard);
    }

    const _onScreenCapture = (res?: ScreenGuardScreenShotPathDataObject | null) => {
      callback(res);
    };
    const listenerCount = screenShotEmitter.listenerCount(
      ScreenGuardConstants.SCREENSHOT_EVT
    );
    if (!listenerCount) {
      screenShotEmitter.addListener(
        ScreenGuardConstants.SCREENSHOT_EVT,
        _onScreenCapture
      );
    }
  },

  /**
   * Screen recording event listener (iOS only)
   * Register for screen recording event listener
   * @version v0.3.6+
   */
  registerScreenRecordingEventListener(callback: (arg: any) => void) {
    if (Platform.OS === 'ios') {
      ScreenGuard.registerScreenRecordingEventListener();
      if (screenRecordingEmitter == null) {
        screenRecordingEmitter = new NativeEventEmitter(ScreenGuard);
      }
      const _onScreenRecording = (res: any) => {
        callback(res);
      };
      const listenerCount = screenRecordingEmitter.listenerCount(
        ScreenGuardConstants.SCREEN_RECORDING_EVT
      );
      if (!listenerCount) {
        screenRecordingEmitter.addListener(
          ScreenGuardConstants.SCREEN_RECORDING_EVT,
          _onScreenRecording
        );
      }
    }
  },
};
