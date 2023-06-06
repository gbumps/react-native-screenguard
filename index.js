import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
const EVENT_NAME = 'onSnapper';
const { ScreenGuard } = NativeModules;
var screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
export default {
  /**
   * activate screenshot blocking
   * @param capturedBackgroundColor
   * @param callback
   */
  register(capturedBackgroundColor, callback) {
    let currentColor =
      capturedBackgroundColor == null ? '#FFFFFF' : capturedBackgroundColor;
    if (Platform.OS === 'ios') {
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
   * Deactivate screenshot
   */
  unregister() {
    // screenGuardEmitter.removeListener(EVENT_NAME);
    ScreenGuard.deactivateShield();
    const listenerCount = screenGuardEmitter.listenerCount(EVENT_NAME);
    if (!listenerCount) {
      screenGuardEmitter.removeEvent();
    }
  },
};
