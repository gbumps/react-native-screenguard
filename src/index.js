import { NativeModules, NativeEventEmitter } from 'react-native';
const EVENT_NAME = 'onSnapper';
const { ScreenGuard } = NativeModules;
var screenGuardEmitter = new NativeEventEmitter(ScreenGuard);
export default {
  register(capturedBackgroundColor, callback) {
    let currentColor =
      capturedBackgroundColor == null ? '#FFFFFF' : capturedBackgroundColor;
    ScreenGuard.activateShield(currentColor);
    const _callback = (res) => {
      callback(res);
    };
    screenGuardEmitter.addListener(EVENT_NAME, _callback);
  },
  unregister() {
    // screenGuardEmitter.removeListener(EVENT_NAME);
    ScreenGuard.deactivateShield();
    const listenerCount = screenGuardEmitter.listenerCount(EVENT_NAME);
    if (!listenerCount) {
      screenGuardEmitter.removeEvent();
    }
  },
};
