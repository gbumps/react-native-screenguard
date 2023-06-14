import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
const EVENT_NAME = 'onSnapper';
const { ScreenGuard } = NativeModules;
var screenGuardEmitter: any = new NativeEventEmitter(ScreenGuard);
const BLACK_COLOR = '#000000';
const REGEX = /[!@#$%^&*(),.?":{}|<>]/;

export default {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * @param string capturedBackgroundColor (iOS only) background color layout after taking a screenshot
   * @param void callback callback after a screenshot or a video capture has been taken
   */
  register(capturedBackgroundColor, callback) {
    ScreenGuard.listenEvent();
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
    const _callback = (res) => {
      callback(res);
    };
    screenGuardEmitter.addListener(EVENT_NAME, _callback);
  },

  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
   * @param void callback callback after a screenshot or a video screen capture has been taken
   */
  registerWithoutScreenguard(callback) {
    // screenGuardEmitter.removeListener(EVENT_NAME);
    ScreenGuard.listenEvent();
    ScreenGuard.activateWithoutShield();
    const _callback = (res) => {
      callback(res);
    };
    screenGuardEmitter.addListener(EVENT_NAME, _callback);
  },

  /**
   * Deactivate screenguard
   * both with and without screenguard can use this
   */
  unregister() {
    // screenGuardEmitter.removeListener(EVENT_NAME);
    ScreenGuard.deactivateShield();
    screenGuardEmitter.removeAllListener(EVENT_NAME);
  },
};
