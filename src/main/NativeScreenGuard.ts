import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  activateShield: (data: {
    /**
     * hex color of the background
     *
     * @defaultValue `#000000` (BLACK)
     *
     */
    backgroundColor: string;
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
    timeAfterResume?: number;
  }) => Promise<void>;
  activateShieldWithoutEffect: () => Promise<void>;
  activateShieldWithBlurView: (data: {
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
    radius: number;
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
    timeAfterResume?: number;
  }) => Promise<void>;
  activateShieldWithImage: (data: {
    /**
     * uri of network image which you want to show
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
    source: {
      uri: string;
    };
    /**
     * default source image from your local project directory,
     *
     * useful when the current source image uri cannot be loaded or error
     *
     * @warning when source is uri image and default source == null
     *
     */
    defaultSource: {
      uri: string;
    };
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
     * @exception when not in between 0..8 and NaN
     *
     * @defaultValue 4 when all positions(top, left, bottom, right) is null and alignment = null
     *
     */
    alignment?: number;
    /**
     *  custom top position of the image
     *
     * @exception when NaN
     *
     * @defaultValue `0`
     *
     */
    top?: number;
    /**
     *  custom left position of the image
     *
     * @exception when NaN
     *
     * @defaultValue `0`
     *
     */
    left?: number;
    /**
     *  custom bottom position of the image
     *
     * @exception when NaN
     *
     * @defaultValue `0`
     *
     */
    bottom?: number;
    /**
     *  custom right position of the image
     *
     * @exception when NaN
     *
     * @defaultValue `0`
     *
     */
    right?: number;
    /**
     * hex color of the background
     *
     * @defaultValue `#000000` (BLACK)
     *
     */
    backgroundColor: string;
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
    timeAfterResume?: number;
  }) => Promise<void>;
  deactivateShield: () => Promise<void>;
}

export default TurboModuleRegistry.get<Spec>('ScreenGuard');
