export const defaultNewElement = (type) => {
  switch (type) {
    case 'Fixed text':
      return { type, value: 'TEXT' };
    case '20-bit random number':
      return { type, format: 'decimal'};
    case '32-bit random number':
      return { type, format: 'decimal'};
    case '6-digit random number':
      return { type, format: 'decimal', length: 6 }
    case '9-digit random number':
      return { type, format: 'decimal', length: 9 };
    case 'Date/time':
      return { type, format: 'YYYY-MM-DD' };
    case 'Sequence':
      return { type, seq: 1 };
    default:
      return { type };
  }
};
export const getRandomInt = (max) => Math.floor(Math.random() * max);

export const generateRandomNumber = (digits, isHex = false) => {
  const base = isHex ? 16 : 10;
  const maxVal = base ** digits;
  const num = getRandomInt(maxVal);
  return num.toString(isHex ? 16 : 10).padStart(digits, '0');
};

export const formatDate = (format) => {
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