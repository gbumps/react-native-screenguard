import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
const EVENT_NAME = 'onSnapper';
const { ScreenGuard } = NativeModules;
var screenGuardEmitter = null;
const BLACK_COLOR = '#000000';
const REGEX = /[!@#$%^&*(),.?":{}|<>]/;
export default {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * @param String? capturedBackgroundColor (iOS only) background color layout after taking a screenshot
   * @param void callback callback after a screenshot or a video capture has been taken
   */
  register(
    capturedBackgroundColor: String | null,
    callback: (arg: any) => void
  ) {
    if (Platform.OS === 'ios') {
      let currentColor =
        capturedBackgroundColor == null ||
        capturedBackgroundColor.trim().length === 0 ||
        !capturedBackgroundColor.trim().startsWith('#') ||
        REGEX.test(capturedBackgroundColor.trim().substring(1))
          ? BLACK_COLOR
          : capturedBackgroundColor;
      ScreenGuard.activateShield(currentColor);
    } else {
      ScreenGuard.activateShield();
    }
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(EVENT_NAME);
    if (!listenerCount) {
      screenGuardEmitter.addListener(EVENT_NAME, _callback);
    }
  },
  /**
   * (iOS only) activate screenshot blocking with a blur effect after captured (iOS 13+, Android 5+)
   * @param radius? (iOS only) blur radius for the view
   * accepted a value in between 15 and 50, throws warning if bigger than 50 or smaller than 15.
   * throws exception when smaller than 1 or not a number
   * @param void callback callback after a screenshot or a video capture has been taken
   * @throws Error when radius smaller than 1 or type != number
   */
  registerWithBlurView(radius, callback) {
    if (Platform.OS === 'ios') {
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
      ScreenGuard.activateShieldWithBlurView(radius);
    } else {
      ScreenGuard.activateShield();
    }
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(EVENT_NAME);
    if (!listenerCount) {
      screenGuardEmitter.addListener(EVENT_NAME, _callback);
    }
  },
  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
   * @param void callback callback after a screenshot or a video screen capture has been taken
   */
  registerWithoutScreenguard(callback: (arg: any) => void) {
    ScreenGuard.activateWithoutShield();
    if (screenGuardEmitter == null) {
      screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
    }
    const _callback = (res) => {
      callback(res);
    };
    const listenerCount = screenGuardEmitter.listenerCount(EVENT_NAME);
    if (!listenerCount) {
      screenGuardEmitter.addListener(EVENT_NAME, _callback);
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
      screenGuardEmitter.removeAllListeners(EVENT_NAME);
      screenGuardEmitter = null;
    }
  },
};
