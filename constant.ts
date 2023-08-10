const EVENT_NAME = 'onSnapper';
const BLACK_COLOR = '#000000';
const REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const IMAGE_REGEX = /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i;
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
  EVENT_NAME,
  BLACK_COLOR,
  REGEX,
  IMAGE_REGEX,
  Alignment,
  RADIUS_DEFAULT,
  TIME_DELAYED,
};
