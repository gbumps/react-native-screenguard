export interface ScreenGuardImageDataObject {
  /**
   * uri of network image which you want to show, or from your project local image source
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
  source: { uri: string } | number;
  /**
   * default source image from your local project directory,
   *
   * useful when the current source image uri cannot be loaded or error
   *
   * @warning when source is uri image and default source == null
   *
   */
  defaultSource?: number;
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
  alignment?: number | 4;
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
  backgroundColor?: string;
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
}

export interface ScreenGuardColorData {
  /**
   * hex color of the background
   *
   * @defaultValue `#000000` (BLACK)
   *
   */
  backgroundColor: string;
}

export interface ScreenGuardScreenShotPathDataObject {
  /**
   * Path of the image after captured
   */
  path?: string | '';
  /**
   * File name of the image after captured
   */
  name?: string | '';
  /**
   * Type of the file captured
   */
  type?: string | '';
}

export interface ScreenGuardScreenRecordDataObject {
  /**
   * recording status
   * true: screen recording is started
   * false: screen recording is stopped
   */
  isRecording?: boolean | false;
}

export interface ScreenGuardHookData {
  /**
   * Method of screenguard activation (blur, image, color)
   * @defaultValue '' (empty string)
   */
  method: string;
  /**
  * check if screenguard is activated
  * @defaultValue false
  */
  isActivated: boolean;
}

export interface ScreenGuardSettingsData {
  /**
   * Enable or disable screen capture option
   * @defaultValue false
   */
  enableCapture?: boolean | false;
  /**
   * Enable or disable screen recording
   * 
   * Supported: iOS 13+, Android 15+ (API 35+)
   * On Android < 15, this setting is ignored and defaults to false.
   * 
   * @defaultValue false
   */
  enableRecord?: boolean | false;
  /**
   * (iOS only) Enable or disable content visibility while multitasking (App Switcher / Recent Apps)
   * 
   * On Android, this is not supported. FLAG_SECURE already blocks content in recent apps,
   * and there's no reliable way to control this behavior separately.
   * 
   * @defaultValue false
   */
  enableContentMultitask?: boolean | false;
  /**
   * (iOS only) When enabled, the screen guard will be displayed over the app if user capture the screen 
   * for a time period based on the timeAfterResume property. If user recording, the screen guard
   * will be displayed over the app and disappear after user stop recording.
   * 
   * WARNING: USE AT YOUR OWN RISK! ONLY ENABLE IF IT'S NOT AFFECTING UI/UX OR APP'S BUSINESS LOGIC;
   * @defaultValue false
   */
  displayScreenGuardOverlay?: boolean | false;
  /**
   * (Android only) When enabled, the screen guard overlay will be displayed when user 
   * returns to the app (after going to home or switching apps) for a time period based 
   * on the timeAfterResume property. If recording, the overlay will show immediately 
   * and stay until recording stops.
   * 
   * NOTE: Unlike iOS, this shows on app resume rather than on screenshot capture.
   * 
   * @defaultValue true
   */
  displayScreenguardOverlayAndroid?: boolean | true;
  /**
   * Time for displaying the screenguard overlay after user captured the screen (in milliseconds)
   * 
   * Work when displayScreenGuardOverlay = true (iOS) or displayScreenguardOverlayAndroid = true (Android)
   *
   * @exception when < 0 or not a number
   *
   * @defaultValue `1000`
   */
  timeAfterResume?: number | 1000;
  /**
   * Get screenshot path after user capture the screen
   * @defaultValue false
  */
  getScreenshotPath?: boolean | false;
  /**
   * Limit the number of screenshot events triggered
   * 
   * null or 0: trigger every time
   * > 0: trigger after n times
   * @defaultValue null
   */
  limitCaptureEvtCount?: number | null;
  /**
   * Allow to recording log in native storage
   * @defaultValue false
   */
  trackingLog?: boolean | false;
}

export interface ScreenGuardLogEntry {
  /**
   * timestamp of the log
   */
  timestamp: number;
  /**
   * action of the log
   */
  action: string;
  /**
   * check if screenguard is activated
   */
  isActivated: boolean;
  /**
   * method of screenguard activation (blur, image, color)
   */
  method: string;
}
