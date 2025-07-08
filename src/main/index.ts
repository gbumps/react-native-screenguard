import { NativeEventEmitter, Platform } from 'react-native';
import * as ScreenGuardData from './data';
import NativeScreenGuard from './NativeScreenGuard';
import NativeSGScreenshot from './NativeSGScreenshot';
import NativeSGScreenRecord from './NativeSGScreenRecord';

import * as ScreenGuardConstants from './constant';

var screenShotEmitter: NativeEventEmitter | null = new NativeEventEmitter(
  NativeSGScreenshot
);

var screenshotSubscription: any = null;
var screenRecordingSubscription: any = null;

var screenRecordingEmitter: NativeEventEmitter | null = new NativeEventEmitter(
  NativeSGScreenRecord
);

export default {
  /**
   * activate screenshot blocking with a color effect (iOS 13+, Android 8+)
   * @param data ScreenGuardColorData object
   * @version v0.0.2+
   */
  async register(data: ScreenGuardData.ScreenGuardColorData) {
    let {
      backgroundColor = ScreenGuardConstants.BLACK_COLOR,
      timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    } = data;

    let trimmedColor = (backgroundColor || '').trim();

    let currentColor = ScreenGuardConstants.REGEX.test(trimmedColor)
      ? trimmedColor
      : ScreenGuardConstants.BLACK_COLOR;

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
    if (Platform.OS === 'android') {
      await NativeScreenGuard?.activateShieldWithoutEffect();
    }
  },

  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 8+)
   * @param data ScreenGuardBlurDataObject data object
   * @version v0.1.2+
   */
  async registerWithBlurView(data: ScreenGuardData.ScreenGuardBlurDataObject) {
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
          require('../images/screenshot_blocking.jpg')
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

    let trimmedColor = (backgroundColor || '').trim();

    let currentColor = ScreenGuardConstants.REGEX.test(trimmedColor)
      ? trimmedColor
      : ScreenGuardConstants.BLACK_COLOR;

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
    NativeSGScreenshot?.registerScreenshotEventListener(getScreenShotPath);
    const _onScreenCapture = (
      res?: ScreenGuardData.ScreenGuardScreenShotPathDataObject | null
    ) => {
      callback(res);
    };
    screenshotSubscription = screenShotEmitter?.addListener(
      ScreenGuardConstants.SCREENSHOT_EVT,
      _onScreenCapture
    );
    return () => this.removeScreenshotEventListener();
  },

  /**
   * Screen recording event listener (iOS only)
   * Register for screen recording event listener
   * @version v0.3.6+
   */
  registerScreenRecordingEventListener(
    getScreenRecordStatus: boolean,
    callback: (
      data?: ScreenGuardData.ScreenGuardScreenRecordDataObject | null
    ) => void
  ) {
    if (Platform.OS === 'android') {
      console.warn('Screen recording event listener is only available on iOS!');
      return;
    }
    NativeSGScreenRecord?.registerScreenRecordingEventListener(
      getScreenRecordStatus ?? false
    );
    const _onScreenRecording = (
      res?: ScreenGuardData.ScreenGuardScreenRecordDataObject | null
    ) => {
      callback(res);
    };
    screenRecordingSubscription = screenRecordingEmitter?.addListener(
      ScreenGuardConstants.SCREEN_RECORDING_EVT,
      _onScreenRecording
    );
    return () => this.removeRecordingEventListener();
  },

  /**
   * Remove screen recording event listener
   * @version v1.0.8+
   */
  removeRecordingEventListener() {
    if (Platform.OS === 'android') {
      console.warn('Screen recording event listener is only available on iOS!');
      return;
    }
    NativeSGScreenRecord?.removeScreenRecordingEventListener();
    // screenRecordingEmitter?.removeAllListeners(
    // ScreenGuardConstants.SCREEN_RECORDING_EVT
    // );
    if (screenRecordingSubscription != null) {
      screenRecordingSubscription.remove();
      screenRecordingSubscription = null;
    }
  },

  /**
   * Remove screenshot event listener
   * @version v1.0.8+
   */
  removeScreenshotEventListener() {
    NativeSGScreenshot?.removeScreenshotEventListener();
    // screenShotEmitter?.removeAllListeners(ScreenGuardConstants.SCREENSHOT_EVT);
    if (screenshotSubscription != null) {
      screenshotSubscription.remove();
      screenshotSubscription = null;
    }
  },
};

export { ScreenGuardConstants };
