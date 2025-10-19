import Form from 'react-bootstrap/Form';

export const renderFieldInput = (field, index, fields, setFields) => {
  const handleChange = (value) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };

  const placeholderText = field.type; 

  switch (field.type) {
    case 'line':
      return (
        <Form.Group className="mb-3" controlId={`input-${index}`}>
          <Form.Label title={field.desc}>{field.desc}</Form.Label>
          <Form.Control
            type="text"
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Form.Group>
      );

    case 'multiline':
      return (
        <Form.Group className="mb-3" controlId={`textarea-${index}`}>
          <Form.Label title={field.desc}>{field.desc}</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Form.Group>
      );

    case 'number':
      return (
        <Form.Group className="mb-3" controlId={`input-number-${index}`}>
          <Form.Label title={field.desc}>{field.desc}</Form.Label>
          <Form.Control
            type="number"
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Form.Group>
      );

    case 'url':
      return (
        <Form.Group className="mb-3" controlId={`input-document-${index}`}>
          <Form.Label title={field.desc}>{field.desc}</Form.Label>
          <Form.Control
            type="text"
            placeholder={placeholderText}
            value={field.value || ''}
            onChange={(e) => handleChange(e.target.value)}
          />
        </Form.Group>
      );

    case 'bool':
      return (
        <Form.Group className="mb-3" controlId={`checkbox-${index}`}>
          <Form.Check
            type="checkbox"
            label={field.desc}
            title={field.dedsc}
            checked={field.value || false}
            onChange={(e) => handleChange(e.target.checked)}
          />
        </Form.Group>
      );

    default:
      return null;
  }
};
