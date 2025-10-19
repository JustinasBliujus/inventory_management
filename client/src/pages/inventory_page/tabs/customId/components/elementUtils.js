import {
  DIGITS_FOR_32_BITS_HEX,
  DIGITS_FOR_32_BITS_DEC,
  DIGITS_FOR_20_BITS_DEC,
  DIGITS_FOR_20_BITS_HEX,
} from '../../constants';

const getRandomInt = (max) => Math.floor(Math.random() * max);

const generateRandomNumber = (digits, isHex = false) => {
  const base = isHex ? 16 : 10;
  const maxVal = base ** digits;
  const num = getRandomInt(maxVal);
  return num.toString(isHex ? 16 : 10).padStart(digits, '0');
};

const formatDate = (format) => {
  const now = new Date();

  switch (format) {
    case 'YYYY':
      return now.getFullYear().toString();
    case 'MM':
      return String(now.getMonth() + 1).padStart(2, '0');
    case 'DD':
      return String(now.getDate()).padStart(2, '0');
    case 'YYYY-MM':
      return now.toISOString().slice(0, 7);
    case 'ISO':
    default:
      return now.toISOString().slice(0, 10);
  }
};

export const renderValue = (el) => {
  switch (el.type) {
    case 'Fixed text':
      return el.value || '';

    case '20-bit random number':
      return generateRandomNumber(
        el.format === 'hex' ? DIGITS_FOR_20_BITS_HEX : DIGITS_FOR_20_BITS_DEC,
        el.format === 'hex'
      );

    case '32-bit random number':
      return generateRandomNumber(
        el.format === 'hex' ? DIGITS_FOR_32_BITS_HEX : DIGITS_FOR_32_BITS_DEC,
        el.format === 'hex'
      );

    case '6-digit random number':
      return String(getRandomInt(1_000_000)).padStart(6, '0');

    case '9-digit random number':
      return String(getRandomInt(1_000_000_000)).padStart(9, '0');

    case 'GUID':
      return crypto.randomUUID();

    case 'Date/time':
      return formatDate(el.format);

    case 'Sequence':
      return String(el.seq ?? 1);

    default:
      return '';
  }
};

export const defaultNewElement = (type, format = 'decimal') => {
  switch (type) {
    case 'Fixed text':
      return { type, value: 'TEXT' };
    case '20-bit random number':
      return { type, format };
    case '32-bit random number':
      return { type, format };
    case '6-digit random number':
      return { type, length: 6 };
    case '9-digit random number':
      return { type, length: 9 };
    case 'Date/time':
      return { type, format: format || 'YYYY-MM-DD' };
    case 'Sequence':
      return { type, seq: 1 };
    default:
      return { type, format };
  }
};

export const createNewElement = (type, format = 'decimal') => {
  const element = defaultNewElement(type, format);
  const previewValue = renderValue(element);
  return { ...element, value: previewValue };
};
