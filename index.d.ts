interface ScreenGuardImageDataObject {
  /**
   * string uri of image which you want to show.
   * Accept jpg | jpeg | png | gif | bmp | webp | svg
   */
  uri: string;
  /**
   *  double width of the image, must be > 0
   */
  width: number;
  /**
   *  double height of the image, must be > 0
   */
  height: number;
  /**
   *  int alignment of the image, following order, default = 4 if null (center)
   *  topLeft: 0,
   *  topCenter: 1,
   *  topRight: 2,
   *  centerLeft: 3,
   *  center: 4,
   *  centerRight: 5,
   *  bottomLeft: 6,
   *  bottomCenter: 7,
   *  bottomRight: 8,
   */
  alignment?: number | null;
  /**
   *  string hex color, default is black
   */
  backgroundColor?: string | null;
}
declare const _default: {
  /**
   * activate screenshot blocking (iOS 13+, Android 5+)
   * Android will receive background color as app state fallback to inactive or background.
   * @param capturedBackgroundColor background color layout after taking a screenshot
   * @param callback void callback after a screenshot or a video capture has been taken
   */
  register(
    capturedBackgroundColor: String | null,
    callback: (arg: any) => void
  ): void;
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
    radius: number,
    timeAfterResume: number,
    callback: any
  ): void;
  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
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
