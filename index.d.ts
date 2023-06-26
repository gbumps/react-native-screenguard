declare const _default: {
  /**
   * activate screenshot blocking (iOS13+, Android 5+)
   * @param string capturedBackgroundColor (iOS only) background color layout after taking a screenshot
   * @param void callback callback after a screenshot has been taken
   */
  register(
    capturedBackgroundColor: String | null,
    callback: (arg0: any) => void
  ): void;
  /**
   * activate without blocking screenshot (iOS 10+, Android 5+ )
   * @param void callback callback after a screenshot has been taken
   */
  registerWithoutScreenguard(callback: (arg0: any) => void): void;
  /**
   * Activate screenshot blocking with a blur effect after captured (iOS 13+, Android 5+)
   * accepted a value in between 15 and 50, throws warning if bigger than 50 or smaller than 15.
   * throws exception when smaller than 1 or not a number
   * Android not yet supported, as fallback automatically to register
   * @param void callback callback after a screenshot or a video capture has been taken
   * @param radius? (iOS only) blur radius for the view
   * @throws Error when radius smaller than 1 or type != number
   */
  registerWithBlurView(radius: number, callback: (arg0: any) => void): void;
  /**
   * Deactivate screenshot
   */
  unregister(): void;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
