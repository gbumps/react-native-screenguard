import { ScreenGuardBlurDataObject, ScreenGuardImageDataObject } from 'data';
declare const _default: {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * @param capturedBackgroundColor background color layout after taking a screenshot
   * @param callback void callback after a screenshot or a video capture has been taken
   */
  register(
    capturedBackgroundColor: String | null,
    callback: (arg: any) => void
  ): void;
  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 6+)
   * @param data ScreenGuardBlurDataObject data object
   * @param callback void callback after a screenshot or a video capture has been taken
   * @throws Error when radius smaller than 1 or type != number
   */
  registerWithBlurView(data: ScreenGuardBlurDataObject, callback: any): void;
  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
   * For screenshot detector only, this will fit your need.
   * @param void callback callback after a screenshot or a video screen capture has been taken
   */
  registerWithoutScreenguard(callback: (arg: any) => void): void;
  /**
   * activate shield with an Image uri (iOS 13+, Android 5+)
   * @param data ScreenGuardImageDataObject data object,
   * @param callback void callback after a screenshot or a video screen capture has been taken
   */
  registerWithImage(
    data: ScreenGuardImageDataObject,
    callback: (arg: any) => void
  ): void;
  /**
   * Deactivate screenguard
   * both with and without screenguard can use this
   */
  unregister(): void;
};
export default _default;
