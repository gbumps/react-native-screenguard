"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _reactNative = require("react-native");
const EVENT_NAME = 'onSnapper';
const {
  ScreenGuard
} = _reactNative.NativeModules;
var screenGuardEmitter = new _reactNative.NativeEventEmitter(ScreenGuard);
const BLACK_COLOR = '#000000';
const REGEX = /[!@#$%^&*(),.?":{}|<>]/;
var _default = {
  /**
   * activate screenshot blocking (iOS13+, Android 5+)
   * @param string capturedBackgroundColor (iOS only) background color layout after taking a screenshot
   * @param void callback callback after a screenshot has been taken
   */
  register(capturedBackgroundColor, callback) {
    if (_reactNative.Platform.OS === 'ios') {
      let currentColor = capturedBackgroundColor == null || capturedBackgroundColor.trim().length === 0 || !capturedBackgroundColor.trim().startsWith('#') || REGEX.test(capturedBackgroundColor.trim().substring(1)) ? BLACK_COLOR : capturedBackgroundColor;
      ScreenGuard.activateShield(currentColor);
    } else {
      ScreenGuard.activateShield();
    }
    const _callback = res => {
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
  }
};
exports.default = _default;
//# sourceMappingURL=index.js.map