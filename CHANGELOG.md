# Changelog

## v1.1.1 (2025-12-20)
* What's Changed
  * helper.js: fix ScreenGuardConstants import by @irbisdev in https://github.com/gbumps/react-native-screenguard/pull/119
* New Contributors
  * @irbisdev made their first contribution in https://github.com/gbumps/react-native-screenguard/pull/119

## v1.1.0 (2025-07-09)
* 🐛 Bugfix
  * fix #101 #100 due to color parsing failed + enhance reading hex string with 3 characters (for example `#fff`)
  * fix #102 due to possibly `webp` not supported.
  * fix #103 due to `BasedReactPackage` not yet implemented on RN 0.73.

## v.1.0.8 (2025-05-22)
* ✨ Feature
  * New Architecture supported.
* 🐛 Bugfix
  * fix #79 #87 #92
  * hot fix release 1.0.8 #97
* Change
  * Code refactor
  * `unregister`: will not remove screenshot EventListener and screenRecord EventListener. Use explicit removal methods.

## v1.0.6 (2025-02-27)
* 🐛 Bugfix
  * Android: fix `unregister` not working on Android 12+ due to remove SECURE_FLAG on wrong targeted Activity.

## v1.0.4 (2024-11-19)
* 🌈 Improvement
  * iOS: Improve `deactivate` function on iOS.

## v0.3.6 (2024-01-28)
* ✨ Feature
  * Added `registerScreenshotEventListener` and `registerScreenRecordingEventListener`.
* Change
  * `registerWithoutScreenguard` deprecated.

## v0.3.5 (2024-01-10)
* 🌈 Improvement
  * Android: Improve frequent crash when app in background.
* 🐛 Bugfix
  * Fix warning `NativeEventEmitter` appeared several times on Android.

## v0.3.2 (2023-10-28)
* 🐛 Bugfix
  * fix #32, #24, #29.

## v0.2.8 (2023-09-29)
* 🐛 Bugfix
  * Resolve issue #23: Fix missing imageView on iOS.

## v.0.2.6 (2023-09-23)
* 🌈 Improvement
  * iOS: Improve `deactivate` function on iOS.

## v0.2.4 (2023-09-12)
* Temporary disabled the protection filter effect `ScreenGuardColorActivity` on Android due to input issues.

## v1.0.4-beta (2023-09-03)
* Change
  * Android: Move enums to package `enums`.

## v.0.2.2 (2023-09-03)
* 🐛 Bugfix
  * Fix TextInput cannot be focused on iOS after screen protector activation.
* Change
  * Move `registerWithBlurView` and `registerWithImage` to beta version.
  * Temporary disabled `ScreenGuardColorActivity` on Android 12+.

## v0.1.8 (2023-08-10)
* Hot fix crash on iOS 16.6.

## v0.1.6 (2023-06-26)
* Republish due to README not showing on npmjs.

## v0.1.4 (2023-06-26)
* Bring support of `register` with background color for Android.

## v.0.1.2 (2023-06-18)
* Add `registerWithBlurView`.

## v0.1.0 (2023-06-15)
* Fix iOS crashes after multiple `register` calls.
* Fix iOS background color not registered on first call.
* Fix event callback fire many times after capture.
