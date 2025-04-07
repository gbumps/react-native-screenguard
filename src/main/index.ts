import { NativeEventEmitter, Platform } from 'react-native';
import * as ScreenGuardData from './data';
import NativeScreenGuard from './NativeScreenGuard';
import * as ScreenGuardConstants from './constant';

var screenShotEmitter: NativeEventEmitter | null = new NativeEventEmitter();

var screenRecordingEmitter: NativeEventEmitter | null =
  new NativeEventEmitter();

export default {
  /**
   * activate screenshot blocking with a color effect (iOS 13+, Android 8+)
   * @param data ScreenGuardColorData object
   * @version v0.0.2+
   */
  register(data: ScreenGuardData.ScreenGuardColorData) {
    let {
      backgroundColor = ScreenGuardConstants.BLACK_COLOR,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;

    let currentColor =
      backgroundColor.trim().length === 0 ||
      !backgroundColor.trim().startsWith('#') ||
      ScreenGuardConstants.REGEX.test(backgroundColor.trim().substring(1))
        ? ScreenGuardConstants.BLACK_COLOR
        : data.backgroundColor;
    NativeScreenGuard?.activateShield({
      backgroundColor: currentColor,
      timeAfterResume,
    });
  },

  /**
   * (Android only) activate screenshot and screen record blocking without
   * any effect (blur, image, color) on Android (Android 5+)
   * @version v1.0.0+
   */
  registerWithoutEffect() {
    if (Platform.OS === 'android') {
      NativeScreenGuard?.activateShieldWithoutEffect();
    }
  },

  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 8+)
   * @param data ScreenGuardBlurDataObject data object
   * @version v0.1.2+
   */
  registerWithBlurView(data: ScreenGuardData.ScreenGuardBlurDataObject) {
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
    NativeScreenGuard?.activateShieldWithBlurView({
      radius,
      timeAfterResume,
    });
  },

  /**
   * activate with an Image uri (iOS 13+, Android 8+)
   * @param data ScreenGuardImageDataObject data object,
   * @version v1.0.2+
   */
  registerWithImage(data: ScreenGuardData.ScreenGuardImageDataObject) {
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
      source = { uri: ScreenGuardConstants.resolveAssetSource(data.source) };
    }

    if (defaultSource == null) {
      console.warn(
        'Consider adding a default source to display image that cannot be loaded from uri!'
      );
      newDefaultSource = {
        uri: ScreenGuardConstants.resolveAssetSource(
          require('../images/screenshot_blocking.webp')
        ),
      };
    } else {
      newDefaultSource = {
        uri: ScreenGuardConstants.resolveAssetSource(data.source),
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

    NativeScreenGuard?.activateShieldWithImage({
      source,
      defaultSource: newDefaultSource,
      width,
      height,
      top,
      left,
      bottom,
      right,
      alignment,
      backgroundColor,
      timeAfterResume,
    });
  },

  /**
   * Deactivate screenguard
   * Clear all screen protector and event listening
   * @version v0.0.2+
   */
  unregister() {
    NativeScreenGuard?.deactivateShield();
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
    getScreenShotPath: boolean,
    callback: (
      data?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null
    ) => void
  ) {
    NativeScreenGuard?.registerScreenshotEventListener(getScreenShotPath);
    screenShotEmitter?.removeAllListeners(ScreenGuardConstants.SCREENSHOT_EVT);

    const _onScreenCapture = (
      res?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null
    ) => {
      callback(res);
    };
    screenShotEmitter?.addListener(
      ScreenGuardConstants.SCREENSHOT_EVT,
      _onScreenCapture
    );
    return () =>
      screenShotEmitter?.removeAllListeners(
        ScreenGuardConstants.SCREENSHOT_EVT
      );
  },

  /**
   * Screen recording event listener (iOS only)
   * Register for screen recording event listener
   * @version v0.3.6+
   */
  registerScreenRecordingEventListener(
    callback: (
      res?: ScreenGuardData.ScreenGuardScreenRecordDataObject | null
    ) => void
  ) {
    if (Platform.OS === 'ios') {
      NativeScreenGuard?.registerScreenRecordingEventListener();
      screenRecordingEmitter?.removeAllListeners(
        ScreenGuardConstants.SCREEN_RECORDING_EVT
      );
      const _onScreenRecording = (
        res?: ScreenGuardData.ScreenGuardScreenRecordDataObject | null
      ) => {
        callback(res);
      };
      screenRecordingEmitter?.addListener(
        ScreenGuardConstants.SCREEN_RECORDING_EVT,
        _onScreenRecording
      );
    }
    return () =>
      screenRecordingEmitter?.removeAllListeners(
        ScreenGuardConstants.SCREEN_RECORDING_EVT
      );
  },
};

export { ScreenGuardConstants };
