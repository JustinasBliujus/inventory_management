import Form from 'react-bootstrap/Form';
import '../../../../components/darkMode.css'

export const renderFieldInput = (field, index, fields, setFields, darkMode = false) => {
  const handleChange = (value) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };

  const placeholderText = field.type;

  const inputStyle = darkMode
    ? {
        backgroundColor: '#3a3a3a',
        color: 'white',
        borderColor: '#555',
      }
    : {};

  const labelStyle = darkMode ? { color: 'white' } : {};

  switch (field.type) {
    case 'line':
      return (
        <Form.Group className="mb-3" controlId={`input-${index}`}>
          <Form.Label title={field.desc} style={labelStyle}>{field.desc}</Form.Label>
          <Form.Control
            type="text"
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            className={`${darkMode ? 'bg-dark-placeholder bg-dark text-white border-secondary' : 'bg-light-placeholder'}`}
          />
        </Form.Group>
      );

    case 'multiline':
      return (
        <Form.Group className="mb-3" controlId={`textarea-${index}`}>
          <Form.Label title={field.desc} style={labelStyle}>{field.desc}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            className={`${darkMode ? 'bg-dark-placeholder bg-dark text-white border-secondary' : 'bg-light-placeholder'}`}
          />
        </Form.Group>
      );

    case 'number':
      return (
        <Form.Group className="mb-3" controlId={`input-number-${index}`}>
          <Form.Label title={field.desc} style={labelStyle}>{field.desc}</Form.Label>
          <Form.Control
            type="number"
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            className={`${darkMode ? 'bg-dark-placeholder bg-dark text-white border-secondary' : 'bg-light-placeholder'}`}
          />
        </Form.Group>
      );

    case 'url':
      return (
        <Form.Group className="mb-3" controlId={`input-document-${index}`}>
          <Form.Label title={field.desc} style={labelStyle}>{field.desc}</Form.Label>
          <Form.Control
            type="text"
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
            style={inputStyle}
            className={`${darkMode ? 'bg-dark-placeholder bg-dark text-white border-secondary' : 'bg-light-placeholder'}`}
          />
        </Form.Group>
      );

    case 'bool':
      return (
        <Form.Group className="mb-3" controlId={`checkbox-${index}`}>
          <Form.Check
            type="checkbox"
            label={field.desc}
            title={field.desc}
            checked={field.value || false}
            onChange={(e) => handleChange(e.target.checked)}
            style={darkMode ? { color: 'white' } : {}}
          />
        </Form.Group>
      );

    default:
      return null;
  }
};
