export interface ScreenGuardImageDataObject {
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

export interface ScreenGuardBlurDataObject {
  /**
   *  The number of blur radius, default = 15
   *  Will throw a warning if smaller than 15 or greater than 50
   *  Throws an exception when radius < 0 or not a number
   */
  radius?: number;
  /**
   *  (Android only) Time delayed for the blur view to stop displaying when going back
   *       to the application (in milliseconds), default 1000ms
   */
  timeAfterResume?: number;
}
