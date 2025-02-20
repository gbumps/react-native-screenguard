var TurboModuleRegistry = require('react-native/Libraries/TurboModule/RCTExport').TurboModuleRegistry;

const ScreenGuardModule = TurboModuleRegistry.getEnforcing('ScreenGuard');

module.exports = {
  register: (data) => ScreenGuardModule.register(data),
  registerWithoutEffect: () => ScreenGuardModule.registerWithoutEffect(),
  registerWithBlurView: (data) => ScreenGuardModule.registerWithBlurView(data),
  registerWithImage: (data) => ScreenGuardModule.registerWithImage(data),
  unregister: () => ScreenGuardModule.unregister(),
  registerScreenshotEventListener: (getScreenShotPath, callback) => 
    ScreenGuardModule.registerScreenshotEventListener(getScreenShotPath, callback),
  registerScreenRecordingEventListener: (callback) => 
    ScreenGuardModule.registerScreenRecordingEventListener(callback)
};