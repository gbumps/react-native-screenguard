import { NativeModules, Platform, TurboModuleRegistry } from 'react-native';
import * as ScreenGuardData from './data';
import { useScreenGuard } from './useScreenGuard';
import { useSGScreenShot } from './useSGScreenShot';
import { useSGScreenRecord } from './useSGScreenRecord';

import * as ScreenGuardConstants from './constant';
import * as ScreenGuardHelper from './helper';


import { type Spec } from './NativeScreenGuard';

const NativeScreenGuard = TurboModuleRegistry.get<Spec>('ScreenGuard') || NativeModules.ScreenGuard;


let _isInitialized = false;

/**
 * Log error and reject promise
 * @param message error message
 * @private
 */
const _logError = (message: any) => {
  console.error(message);
  return Promise.reject(message);
};

export default {
  /**
   * initialize the screen guard with settings
   * @param data ScreenGuardSettingsData
   * @version v0.0.2+
   */
  async initSettings(data?: ScreenGuardData.ScreenGuardSettingsData | null): Promise<void | string> {
    let currentSettings = {
      enableCapture: data?.enableCapture ?? false,
      enableRecord: data?.enableRecord ?? false,
      enableContentMultitask: data?.enableContentMultitask ?? false,
      displayOverlay: data?.displayOverlay ?? false,
      timeAfterResume: data?.timeAfterResume ?? ScreenGuardConstants.TIME_DELAYED,
      getScreenshotPath: data?.getScreenshotPath ?? false,
      limitCaptureEvtCount: data?.limitCaptureEvtCount ?? undefined,
      trackingLog: data?.trackingLog ?? false,
      allowBackpress: data?.allowBackpress ?? false,
    };
    try {
      if (NativeScreenGuard == null) {
        return _logError('ScreenGuard is not initialized, please double check!');
      }
      await NativeScreenGuard?.initSettings(currentSettings);
      _isInitialized = true;
      return;
    } catch (error) {
      _isInitialized = false;
      return _logError(error);
    }
  },
  /**
   * activate screenshot blocking with a color effect (iOS 13+, Android 8+)
   * @param data ScreenGuardColorData object
   * throws error if ScreenGuard is not initialized
   * @version v0.0.2+
   */
  async register(data: ScreenGuardData.ScreenGuardColorData): Promise<void | string> {
    if (!_isInitialized) {
      return _logError(
        'ScreenGuard is not initialized. Please call initSettings() first!'
      );
    }
    let {
      backgroundColor = ScreenGuardConstants.BLACK_COLOR,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;

    let currentColor = ScreenGuardHelper.resolveColorString(backgroundColor);

    try {
      await NativeScreenGuard?.activateShield({
        backgroundColor: currentColor,
        timeAfterResume,
      });
      return;
    } catch (error) {
      return _logError(error);
    }
  },

  /**
   * (Android only) activate screenshot and screen record blocking without
   * any effect (blur, image, color) on Android (Android 5+)
   * throws error if ScreenGuard is not initialized
   * warning if called on iOS platform
   * @version v1.0.0+
   */
  async registerWithoutEffect(): Promise<void | string> {
    if (!_isInitialized) {
      return _logError(
        'ScreenGuard is not initialized. Please call initSettings() first!'
      );
    }
    if (Platform.OS === 'android') {
      await NativeScreenGuard?.activateShieldWithoutEffect();
    } else {
      console.warn(
        'registerWithoutEffect is only available on Android platform!'
      );
    }
    return;
  },

  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 8+)
   * throws error if ScreenGuard is not initialized
   * @param data ScreenGuardBlurDataObject data object
   * @version v0.1.2+
   */
  async registerWithBlurView(data: ScreenGuardData.ScreenGuardBlurDataObject): Promise<void | string> {
    if (!_isInitialized) {
      return _logError(
        'ScreenGuard is not initialized. Please call initSettings() first!'
      );
    }
    const {
      radius = ScreenGuardConstants.RADIUS_DEFAULT,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;
    if (typeof radius !== 'number') {
      return _logError('radius must be a number and bigger than 1');
    }
    if (radius < 1) {
      return _logError('radius must bigger than 1!');
    }
    if (radius >= 1 && radius < 15) {
      console.warn(
        'Consider a radius value bigger than 15, as content still very clear and easy to read!'
      );
    }
    if (radius > 50) {
      console.warn(
        'Consider a radius value in between 15 and 50, as blur contents may vanish inside the view!'
      );
    }
    if (Platform.OS === 'android' && timeAfterResume > 3000) {
      console.warn(
        'Consider a number in between 1000 and 3000 for better user experience!'
      );
    }
    if (
      Platform.OS === 'android' &&
      (timeAfterResume < 0 || isNaN(timeAfterResume))
    ) {
      return _logError('timeAfterResume must be > 0!');
    }

    try {
      await NativeScreenGuard?.activateShieldWithBlurView({
        radius,
        timeAfterResume,
      });
      return;
    } catch (error) {
      return _logError(error);
    }
  },

  /**
   * Activate with an Image uri (iOS 13+, Android 8+)
   * throws error if ScreenGuard is not initialized
   * @param data ScreenGuardImageDataObject data object,
   * @version v1.0.2+
   */
  async registerWithImage(data: ScreenGuardData.ScreenGuardImageDataObject): Promise<void | string> {
    if (!_isInitialized) {
      return _logError('ScreenGuard is not initialized. Please call initSettings() first!');
    }
    let {
      source,
      width,
      height,
      top,
      left,
      bottom,
      right,
      backgroundColor = ScreenGuardConstants.BLACK_COLOR,
      alignment,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
      defaultSource,
    } = data;

    let newDefaultSource: { uri: string } | null = null;

    if (typeof source === 'object' && 'uri' in source) {
      if (source.uri.length === 0) {
        return _logError('uri must not be empty!');
      }
      if (width < 1 || isNaN(width)) {
        return _logError('width of image must bigger than 0!');
      }
      if (height < 1 || isNaN(height)) {
        return _logError('height of image must bigger than 0!');
      }
      if (!ScreenGuardConstants.IMAGE_REGEX.test(source.uri)) {
        console.warn(
          'Looks like the uri is not an image uri. Try to provide a correct image uri for better result!'
        );
      }
    } else if (typeof source === 'number') {
      source = { uri: ScreenGuardHelper.resolveAssetSource(data.source) };
    }

    if (defaultSource == null) {
      console.warn(
        'Consider adding a default source to display image that cannot be loaded from uri!'
      );
      newDefaultSource = {
        uri: ScreenGuardHelper.resolveAssetSource(
          require('./images/screenshot_blocking.jpg')
        ),
      };
    } else {
      newDefaultSource = {
        uri: ScreenGuardHelper.resolveAssetSource(defaultSource),
      };
    }
    if (
      alignment != null &&
      (alignment > 8 || alignment < 0 || isNaN(alignment))
    ) {
      return _logError(
        'alignment must be in range from 0 -> 8 only, values: \n topLeft: 0; \n topCenter: 1; \n topRight: 2; \n centerLeft: 3; \n Center: 4; \n centerRight: 5; \n bottomLeft: 6; \n bottomCenter: 7;\n bottomRight: 8; \n If you want to center the image, leave null instead!'
      );
    }

    if (
      alignment == null &&
      ((top == null && left == null && bottom == null && right == null) ||
        Platform.OS === 'android')
    ) {
      alignment = ScreenGuardConstants.Alignment.center;
    }

    let currentColor = ScreenGuardHelper.resolveColorString(backgroundColor);

    try {
      await NativeScreenGuard?.activateShieldWithImage({
        source,
        defaultSource: newDefaultSource,
        width,
        height,
        top,
        left,
        bottom,
        right,
        alignment,
        backgroundColor: currentColor,
        timeAfterResume,
      });
      return;
    } catch (error) {
      return _logError(error);
    }
  },

  /**
   * Deactivate screenguard
   * Clear all screen protector and event listening
   * throws error if ScreenGuard is not initialized
   * @version v0.0.2+
   */
  async unregister(): Promise<void | string> {
    try {
      if (!_isInitialized) {
        return _logError(
          'ScreenGuard is not initialized. Please call initSettings() first!'
        );
      }
      await NativeScreenGuard?.deactivateShield();
      return;
    } catch (error) {
      return _logError(error);
    }
  },

  /**
   * Get the current logs of screenguard
   * throws error if ScreenGuard is not initialized
   * @param maxCount maximum number of logs to retrieve
   * @version v2.1+
   */
  async getScreenGuardLogs(maxCount = 10): Promise<Array<ScreenGuardData.ScreenGuardLogEntry> | null> {
    try {
      if (!_isInitialized) {
        return _logError(
          'ScreenGuard is not initialized. Please call initSettings() first!'
        );
      }
      return await NativeScreenGuard?.getScreenGuardLogs(maxCount);
    } catch (error) {
      return _logError(error);
    }
  },
};

export { ScreenGuardConstants, useScreenGuard, useSGScreenShot, useSGScreenRecord };
