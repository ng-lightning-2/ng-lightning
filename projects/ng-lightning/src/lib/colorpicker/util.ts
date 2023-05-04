export interface IHSV {
  hue: number;
  saturation: number;
  value: number;
}

export function getHexFromHsv(hsv: IHSV) {
  return hsv ? getHexFromRgb(getRgbFromHsv(hsv)) : null;
}

function getRgbFromHsv({ hue, saturation, value }) {
  const hueRatio = hue / 360;
  const satRatio = saturation / 100;
  const valRatio = value / 100;

  let red;
  let green;
  let blue;

  const i = Math.floor(hueRatio * 6);
  const f = hueRatio * 6 - i;
  const p = valRatio * (1 - satRatio);
  const q = valRatio * (1 - f * satRatio);
  const t = valRatio * (1 - (1 - f) * satRatio);

  switch (i % 6) {
    case 0:
      red = valRatio;
      green = t;
      blue = p;
      break;
    case 1:
      red = q;
      green = valRatio;
      blue = p;
      break;
    case 2:
      red = p;
      green = valRatio;
      blue = t;
      break;
    case 3:
      red = p;
      green = q;
      blue = valRatio;
      break;
    case 4:
      red = t;
      green = p;
      blue = valRatio;
      break;
    default:
      red = valRatio;
      green = p;
      blue = q;
  }

  return {
    red: Math.round(red * 255),
    blue: Math.round(blue * 255),
    green: Math.round(green * 255),
  };
}

function getHex(color) {
  return `0${Math.round(color).toString(16)}`.substr(-2);
}

export function getHexFromRgb({ red, green, blue }) {
  return `#${getHex(red)}${getHex(green)}${getHex(blue)}`;
}

export function getHsvFromHex(hex) {
  return hex ? getHsvFromRgb(getRgbFromHex(hex)) : null;
}

function getHsvFromRgb({ red, green, blue }) {
  const redRatio = red / 255;
  const greenRatio = green / 255;
  const blueRatio = blue / 255;

  const max = Math.max(redRatio, greenRatio, blueRatio);
  const min = Math.min(redRatio, greenRatio, blueRatio);

  const delta = max - min;
  const saturation = max === 0 ? 0 : delta / max * 100;
  const value = max * 100;
  let hue;

  if (max === min) {
    hue = 0;
  } else {
    if (redRatio === max) {
      hue =
        (greenRatio - blueRatio) / delta + (greenRatio < blueRatio ? 6 : 0);
    } else if (greenRatio === max) {
      hue = (blueRatio - redRatio) / delta + 2;
    } else {
      hue = (redRatio - greenRatio) / delta + 4;
    }

    hue *= 60;
  }

  return { hue, saturation, value };
}

const HEX_REGEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;

export function getRgbFromHex(hex) {
  const result = HEX_REGEX.exec(toSixDigitHex(hex));
  return {
    red: parseInt(result[1], 16),
    green: parseInt(result[2], 16),
    blue: parseInt(result[3], 16),
  };
}

function toSixDigitHex(value) {
  const shortHandHex = /^#([a-f\d])([a-f\d])([a-f\d])$/i;
  const match = shortHandHex.exec(value);
  if (match) {
    return `#${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${
      match[3]
      }`;
  }

  return value;
}

export function isValidHex(value: string) {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
}
