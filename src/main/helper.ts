import { Image, ImageSourcePropType } from 'react-native';
import { ScreenGuardConstants } from '.';

const resolveAssetSource = (defaultSource: ImageSourcePropType | any) => {
  if (!defaultSource) {
    return null;
  }
  const resolved = Image.resolveAssetSource(defaultSource);

  if (resolved) {
    return resolved.uri;
  }
  return defaultSource;
};

const resolveColorString = (input: string): string => {
  const str = input.trim();

  const match = str.match(ScreenGuardConstants.REGEX);
  if (!match) {
    return ScreenGuardConstants.BLACK_COLOR;
  }

  let hex = match[1];
  if (hex?.length === 3) {
    hex = hex
      .split('')
      .map((ch) => ch + ch)
      .join('');
  }

  return `#${hex?.toLowerCase()}`;
};

export { resolveAssetSource, resolveColorString };
