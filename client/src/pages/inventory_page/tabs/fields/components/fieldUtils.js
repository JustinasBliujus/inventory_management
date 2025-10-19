export const defaultNewField = (type) => ({
  type,
  title: '',
  desc: '',
  showInTable: true,
});

export const renderFieldPreview = (field) => {
  switch (field.type) {
    case 'line':
      return field.title || 'Example text';
    case 'multiline':
      return field.title ? `Example for ${field.title}` : 'Multi-line example text\nAnother line';
    case 'number':
      return Math.floor(Math.random() * 100); 
    case 'url':
      return 'https://example.com/file.pdf'; 
    case 'bool':
      return Math.random() > 0.5 ? '✔️' : '❌';
    default:
      return '';
  }
};