export const ELEMENT_TYPES = [
  'Fixed text',
  '20-bit random number',
  '32-bit random number',
  '6-digit random number',
  '9-digit random number',
  'GUID',
  'Date/time',
  'Sequence',
];

export const DIGITS_FOR_32_BITS_HEX = 8;
export const DIGITS_FOR_32_BITS_DEC = 9;
export const DIGITS_FOR_20_BITS_DEC = 6;
export const DIGITS_FOR_20_BITS_HEX = 5;
export const MAX_ELEMENTS = 10;

export const ELEMENT_TOOLTIPS = {
  'Fixed text': 
    'Static text that will always appear exactly as entered.',
  '20-bit random number':
    'Generates a random 20-bit number. You can choose decimal (6 digits) or hexadecimal (5 digits) format.',
  '32-bit random number':
    'Generates a random 32-bit number. You can choose decimal (9 digits) or hexadecimal (8 digits) format.',
  '6-digit random number':
    'Generates a random 6-digit decimal number (000000–999999).',
  '9-digit random number':
    'Generates a random 9-digit decimal number (000000000–999999999).',
  'GUID':
    'Generates a globally unique identifier Example: 3f0a5e2c-91a2-4a88-b4de-1f4f9e1d9a2e.',
  'Date/time':
    'Inserts the current date (and optionally month or year). Choose your preferred format.',
  'Sequence':
    'Sequential number that increments automatically each time the ID is generated.',
};
export const FIELD_TYPES = [
  'line',
  'multiline',
  'number',
  'url',
  'bool',
];

export const FIELD_TOOLTIPS = {
  'single-line': 
    'A single line field (up to 50 characters)',
  'multi-line':
    'Multi-line field (up to 200 characters)',
  'numeric':
    'Numeric or a decimal field',
  'document':
    'A field for a link',
  'boolean':
    'True/False field as a checkbox',
};

export const MAX_FIELDS = 3;

export const FIXED_FIELDS = [
  { type: 'single-line', title: 'custom_id', description: 'Editable ID', editable: true, showInTable: true },
  { type: 'single-line', title: 'created_by', description: 'Automatically generated', editable: false, showInTable: true },
  { type: 'single-line', title: 'created_at', description: 'Automatically generated', editable: false, showInTable: true },
];
