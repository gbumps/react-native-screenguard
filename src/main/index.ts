import { Platform } from 'react-native';
import * as ScreenGuardData from './data';
import NativeScreenGuard from './NativeScreenGuard';
import { useScreenGuard } from './useScreenGuard';
import { useSGScreenShot } from './useSGScreenShot';
import { useSGScreenRecord } from './useSGScreenRecord';

import * as ScreenGuardConstants from './constant';
import * as ScreenGuardHelper from './helper';



let _isInitialized = false;

export default {
  /**
   * initialize the screen guard with settings
   * @param data ScreenGuardSettingsData
   * @version v0.0.2+
   */
  async initSettings(data?: ScreenGuardData.ScreenGuardSettingsData | null) {
    let currentSettings = {
      enableCapture: data?.enableCapture ?? false,
      enableRecord: data?.enableRecord ?? false,
      enableContentMultitask: data?.enableContentMultitask ?? false,
      displayOverlay: data?.displayOverlay ?? false,
      timeAfterResume: data?.timeAfterResume ?? ScreenGuardConstants.TIME_DELAYED,
      getScreenshotPath: data?.getScreenshotPath ?? false,
      limitCaptureEvtCount: data?.limitCaptureEvtCount ?? undefined,
      trackingLog: data?.trackingLog ?? false,
    };
    await NativeScreenGuard?.initSettings(currentSettings);
    _isInitialized = true;
  },
  /**
   * activate screenshot blocking with a color effect (iOS 13+, Android 8+)
   * @param data ScreenGuardColorData object
   * @version v0.0.2+
   */
  async register(data: ScreenGuardData.ScreenGuardColorData) {
    if (!_isInitialized) {
      throw new Error('ScreenGuard is not initialized. Please call initSettings() first!');
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
    } catch (error) {
      console.error('Error register:', error);
    }
  },

  /**
   * (Android only) activate screenshot and screen record blocking without
   * any effect (blur, image, color) on Android (Android 5+)
   * @version v1.0.0+
   */
  async registerWithoutEffect() {
    if (!_isInitialized) {
      throw new Error('ScreenGuard is not initialized. Please call initSettings() first!');
    }
    if (Platform.OS === 'android') {
      await NativeScreenGuard?.activateShieldWithoutEffect();
    } else {
      console.warn(
        'registerWithoutEffect is only available on Android platform!'
      );
    }
  },

  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 8+)
   * @param data ScreenGuardBlurDataObject data object
   * @version v0.1.2+
   */
  async registerWithBlurView(data: ScreenGuardData.ScreenGuardBlurDataObject) {
    if (!_isInitialized) {
      throw new Error('ScreenGuard is not initialized. Please call initSettings() first!');
    }
    const {
      radius = ScreenGuardConstants.RADIUS_DEFAULT,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;
    if (typeof radius !== 'number') {
      throw new Error('radius must be a number and bigger than 1');
    }
    if (radius < 1) {
      throw new Error('radius must bigger than 1!');
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
      throw new Error('timeAfterResume must be > 0!');
    }

    try {
      await NativeScreenGuard?.activateShieldWithBlurView({
        radius,
        timeAfterResume,
      });
    } catch (error) {
      console.error('Error registerWithBlurView:', error);
    }
  },

  /**
   * activate with an Image uri (iOS 13+, Android 8+)
   * @param data ScreenGuardImageDataObject data object,
   * @version v1.0.2+
   */
  async registerWithImage(data: ScreenGuardData.ScreenGuardImageDataObject) {
    if (!_isInitialized) {
      throw new Error('ScreenGuard is not initialized. Please call initSettings() first!');
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
        throw new Error('uri must not be empty!');
      }
      if (width < 1 || isNaN(width)) {
        throw new Error('width of image must bigger than 0!');
      }
      if (height < 1 || isNaN(height)) {
        throw new Error('height of image must bigger than 0!');
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
          require('../images/screenshot_blocking.jpg')
        ),
      };
    } else {
      newDefaultSource = {
        uri: ScreenGuardHelper.resolveAssetSource(data.source),
      };
    }
    if (
      alignment != null &&
      (alignment > 8 || alignment < 0 || isNaN(alignment))
    ) {
      throw new Error(
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
    } catch (error) {
      console.error('Error registerWithImage:', error);
    }
  },

  /**
   * Deactivate screenguard
   * Clear all screen protector and event listening
   * @version v0.0.2+
   */
  async unregister() {
    try {
      await NativeScreenGuard?.deactivateShield();
    } catch (error) {
      console.error('Error unregister:', error);
    }
  },

  /**
   * Get the current logs of screenguard
   * @param maxCount maximum number of logs to retrieve
   * @version v2.1+
   */
  async getScreenGuardLogs(maxCount = 10) {
    try {
      return await NativeScreenGuard?.getScreenGuardLogs(maxCount);
    } catch (error) {
      console.error('Error getScreenGuardLogs:', error);
      return [];
    }
  },
};

export { ScreenGuardConstants, useScreenGuard, useSGScreenShot, useSGScreenRecord };
