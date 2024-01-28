export interface ScreenGuardImageDataObject {
  /**
   * uri of image which you want to show.
   *
   * on iOS, accepted jpg | jpeg | png | gif | bmp | webp | svg | tiff | ico | heif (ios 11+)
   *
   * on Android, accepted jpg | jpeg | png | gif | bmp | webp
   *
   * @required
   *
   * @warning when uri is not an image uri or empty
   *
   */
  uri: string;
  /**
   * width of the image
   *
   * @required
   *
   * @exception when < 0 or not a number
   *
   */
  width: number;
  /**
   * height of the image
   *
   * @required
   *
   * @exception when < 0 or not a number
   *
   */
  height: number;
  /**
   *  alignment of the image following by order
   *
   *  topLeft: 0,
   *
   *  topCenter: 1,
   *
   *  topRight: 2,
   *
   *  centerLeft: 3,
   *
   *  center: 4,
   *
   *  centerRight: 5,
   *
   *  bottomLeft: 6,
   *
   *  bottomCenter: 7,
   *
   *  bottomRight: 8,
   *
   * @exception when not in between 0..8
   *
   * @defaultValue `4`
   *
   */
  alignment?: number | 4;
  /**
   * hex color of the background
   *
   * @defaultValue `#000000` (BLACK)
   *
   */
  backgroundColor?: string | '#000000';
  /**
   * (Android only) Time delayed for the view to stop displaying when going back
   * to the application (in milliseconds)
   *
   * @warning when bigger than 3000ms means users have to wait for the application
   * to turn off the filter before going back to the main view, which is a very bad user
   * experiences.
   *
   * @exception when < 0 or not a number
   *
   * @defaultValue `1000`
   */
  timeAfterResume?: number | 1000;
}
export interface ScreenGuardBlurDataObject {
  /**
   * The number of blur radius, in between 15 and 50.
   *
   * @warning when smaller than 15 or bigger than 50. Smaller will make content
   * still very clear and easy to read, bigger will make the content vanished, blurring
   * is meaningless.
   *
   * @exception when radius < 0 or not a number
   *
   * @defaultValue `15`
   */
  radius?: number | 15;
  /**
   * (Android only) Time delayed for the blur view to stop displaying when going back
   * to the application (in milliseconds)
   *
   * @warning when bigger than 3000ms means users have to wait for the application
   * to turn off the filter before going back to the main view, which is a very bad user
   * experiences.
   *
   * @exception when < 0 or not a number
   *
   * @defaultValue `1000`
   */
  timeAfterResume?: number | 1000;
}
