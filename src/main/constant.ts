const SCREENSHOT_EVT = 'onScreenShotCaptured';
const SCREEN_RECORDING_EVT = 'onScreenRecordingCaptured';
const BLACK_COLOR = '#000000';
const REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|heic|svg)$/i;
const RADIUS_DEFAULT = 15;
const TIME_DELAYED = 1000;

const Alignment = {
  topLeft: 0,
  topCenter: 1,
  topRight: 2,
  centerLeft: 3,
  center: 4,
  centerRight: 5,
  bottomLeft: 6,
  bottomCenter: 7,
  bottomRight: 8,
};

export {
  SCREENSHOT_EVT,
  SCREEN_RECORDING_EVT,
  BLACK_COLOR,
  REGEX,
  IMAGE_REGEX,
  Alignment,
  RADIUS_DEFAULT,
  TIME_DELAYED,
};
