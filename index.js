import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import * as ScreenGuardConstants from 'constant';
const { ScreenGuard } = NativeModules;
var screenGuardEmitter = null;
export default {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * Android will received background color as app state fallback to inactive or background.
   * @param capturedBackgroundColor background color layout after taking a screenshot
   * @param callback void callback after a screenshot or a video capture has been taken
   */
  register(capturedBackgroundColor, callback) {
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
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(
      ScreenGuardConstants.EVENT_NAME
    );
    if (!listenerCount) {
      screenGuardEmitter.addListener(
        ScreenGuardConstants.EVENT_NAME,
        _callback
      );
    }
  },
  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 6+)
   * Accepted a radius value in between 15 and 50, throws warning if bigger than 50 or smaller than 15.
   * on Android, before coming back to the application main view, there will be a small amount of time delayed for
   * the blur view to stop displaying, default 1000ms.
   * Throws exception when radius smaller than 1 or not a number
   * @param callback callback callback after a screenshot or a video capture has been taken
   * @param radius blur radius for the view
   * @param timeAfterResume (Android only) time delay in milliseconds to turn off the blurview after coming back to application, default: 1000ms
   * @throws Error when radius smaller than 1 or type != number
   */
  registerWithBlurView(
    radius = ScreenGuardConstants.RADIUS_DEFAULT,
    timeAfterResume = ScreenGuardConstants.TIME_DELAYED,
    callback
  ) {
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
    if (Platform.OS === 'android' && timeAfterResume > 4000) {
      console.warn(
        'Consider a number in between 1000 and 3000 for better user experience!'
      );
    }
    if (Platform.OS === 'ios') {
      ScreenGuard.activateShieldWithBlurView(radius);
    } else {
      ScreenGuard.activateShieldWithBlurView(radius, timeAfterResume);
    }
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(
      ScreenGuardConstants.EVENT_NAME
    );
    if (!listenerCount) {
      screenGuardEmitter.addListener(
        ScreenGuardConstants.EVENT_NAME,
        _callback
      );
    }
  },
  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
   * @param void callback callback after a screenshot or a video screen capture has been taken
   */
  registerWithoutScreenguard(callback) {
    ScreenGuard.activateWithoutShield();
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(
      ScreenGuardConstants.EVENT_NAME
    );
    if (!listenerCount) {
      screenGuardEmitter.addListener(
        ScreenGuardConstants.EVENT_NAME,
        _callback
      );
    }
  },
  /**
   * activate shield with an Image uri (iOS 13+, Android 5+)
   * @param data ScreenGuardImageDataObject data object,
   * @param callback void callback after a screenshot or a video screen capture has been taken
   */
  registerWithImage(data, callback) {
    const {
      uri,
      width,
      height,
      backgroundColor = ScreenGuardConstants.BLACK_COLOR,
      alignment = ScreenGuardConstants.Alignment.center,
    } = data;
    if (uri.length === 0) {
      throw new Error('uri must not be empty!');
    }
    if (width < 1) {
      throw new Error('width of image must bigger than 0!');
    }
    if (height < 1) {
      throw new Error('height of image must bigger than 0!');
    }
    if (!ScreenGuardConstants.IMAGE_REGEX.test(data.uri)) {
      console.warn(
        'Looks like the uri is not an image uri. Try to provide a correct image uri for better result!'
      );
    }
    if (alignment != null && (alignment > 8 || alignment < 0)) {
      throw new Error(
        'alignment must be in range from 0 -> 8 only, values: \n topLeft: 0; \n topCenter: 1; \n topRight: 2; \n centerLeft: 3; \n Center: 4; \n centerRight: 5; \n bottomLeft: 6; \n bottomCenter: 7;\n bottomRight: 8; \n If you want to center the image, leave null instead!'
      );
    }
    ScreenGuard.activateShieldWithImage({
      uri,
      width,
      height,
      alignment,
      backgroundColor,
    });
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(
      ScreenGuardConstants.EVENT_NAME
    );
    if (!listenerCount) {
      screenGuardEmitter.addListener(
        ScreenGuardConstants.EVENT_NAME,
        _callback
      );
    }
  },
  /**
   * Deactivate screenguard
   * both with and without screenguard can use this
   */
  unregister() {
    // screenGuardEmitter.removeListener(EVENT_NAME);
    ScreenGuard.deactivateShield();
    if (screenGuardEmitter != null) {
      screenGuardEmitter.removeAllListeners(ScreenGuardConstants.EVENT_NAME);
      screenGuardEmitter = null;
    }
  },
};
