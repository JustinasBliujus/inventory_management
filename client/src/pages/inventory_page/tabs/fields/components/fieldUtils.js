export const defaultNewField = (type) => ({
  type,
  title: '',
  description: '',
  showInTable: false,
});

export const renderFieldPreview = (field) => {
  switch (field.type) {
    case 'single-line':
      return field.title || 'Example text';
    case 'multi-line':
      return field.title ? `Example for ${field.title}` : 'Multi-line example text\nAnother line';
    case 'numeric':
      return Math.floor(Math.random() * 100); // random number for preview
    case 'document':
      return 'https://example.com/file.pdf'; // sample document/image link
    case 'boolean':
      return Math.random() > 0.5 ? '✔️' : '❌'; // checkbox preview
    default:
      return '';
  }
};