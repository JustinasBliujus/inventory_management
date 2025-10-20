import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { userService } from '../../../api/userService';
import SharedNavbar from '../../components/navbar';
import '../../components/darkMode.css'
import { useAppContext } from '../../../appContext';

function AddItemsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { inventory } = location.state || {};
  const { darkMode } = useAppContext();
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);

  if (!inventory) return <p>No inventory selected</p>;

  const customTypes = ['line', 'multiline', 'number', 'url', 'bool'];

  const formFields = [];
  for (let type of customTypes) {
    for (let i = 1; i <= 3; i++) {
      const stateKey = `custom_${type}${i}_state`;
      const showKey = `custom_${type}${i}_show`;
      const nameKey = `custom_${type}${i}_name`;
      const descKey = `custom_${type}${i}_desc`;

      if (inventory[stateKey]) {
        formFields.push({
          type,
          index: i,
          show: inventory[showKey],
          name: inventory[nameKey] || `Custom ${type} ${i}`,
          desc: inventory[descKey] || '',
          key: `${type}${i}`,
        });
      }
    }
  }

  const handleChange = (key, value) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };
 
  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const itemData = {};

    Object.entries(formValues).forEach(([key, value]) => {
      if (key.startsWith('line')) itemData[`custom_${key}`] = value;
      else if (key.startsWith('multiline')) itemData[`custom_${key}`] = value;
      else if (key.startsWith('number')) itemData[`custom_${key}`] = value;
      else if (key.startsWith('url')) itemData[`custom_${key}`] = value;
      else if (key.startsWith('bool')) itemData[`custom_${key}`] = value;
    });

    itemData.inventory_id = inventory.id;

    const response = await userService.addItem(inventory.id, itemData);

    console.log('Item added successfully:', response.data);
    navigate(-1);
  } catch (error) {
    console.error('Error adding item:', error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <SharedNavbar></SharedNavbar>
    <Container className='p-5 mt-2'>
      <h2 className='text-center mb-4'>Add New Item to Inventory: {inventory.name}</h2>
      <Form onSubmit={handleSubmit}>
        {formFields.map(field => {
          if (!field.show) return null;

          let inputElement = null;

          switch (field.type) {
            case 'line':
              inputElement = (
                <Form.Control
                  className={darkMode ? 'textarea-dark' : ''}
                  type="text"
                  value={formValues[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              );
              break;
            case 'multiline':
              inputElement = (
                <Form.Control
                  className={darkMode ? 'textarea-dark' : ''}
                  as="textarea"
                  rows={3}
                  value={formValues[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              );
              break;
            case 'number':
              inputElement = (
                <Form.Control
                  className={darkMode ? 'textarea-dark' : ''}
                  type="number"
                  value={formValues[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              );
              break;
            case 'url':
              inputElement = (
                <Form.Control
                  className={darkMode ? 'textarea-dark' : ''}
                  type="url"
                  value={formValues[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              );
              break;
            case 'bool':
              inputElement = (
                <Form.Check
                  type="checkbox"
                  label=""
                  checked={formValues[field.key] || false}
                  onChange={e => handleChange(field.key, e.target.checked)}
                />
              );
              break;
            default:
              inputElement = null;
          }

          return (
            <Form.Group key={field.key} className="mb-3">
              <Form.Label>{field.name}</Form.Label>
              {inputElement}
              {field.desc && <Form.Text className="text-muted">{field.desc}</Form.Text>}
            </Form.Group>
          );
        })}

        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Item'}
        </Button>
      </Form>
    </Container>
    </div>
  );
}

export default AddItemsPage;
