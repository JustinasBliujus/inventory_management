import {
  DIGITS_FOR_32_BITS_HEX,
  DIGITS_FOR_32_BITS_DEC,
  DIGITS_FOR_20_BITS_DEC,
  DIGITS_FOR_20_BITS_HEX,
} from '../../constants';

import { getRandomInt, generateRandomNumber,formatDate} from './elementUtils'

export const renderPreview = (el) => {
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
