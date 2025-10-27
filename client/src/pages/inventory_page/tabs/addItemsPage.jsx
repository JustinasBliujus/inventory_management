import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Container } from 'react-bootstrap';
import { userService } from '../../../api/userService';
import SharedNavbar from '../../components/navbar';
import '../../components/darkMode.css';
import { useAppContext } from '../../../appContext';
import { renderValue } from './customId/components/elementUtils'
import { useTranslation } from 'react-i18next';

function AddItemsPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { inventory, mapping, item_id } = location.state || {};
  const { darkMode } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [elements, setElements] = useState([]);
  
  useEffect(() => {
      if (!inventory?.customID) return;
  
      const newElements = [];
      for (let i = 0; i < 10; i++) {
        const type = inventory.customID[`part_${i + 1}_type`];
        const format = inventory.customID[`part_${i + 1}_format`];
        const value = inventory.customID[`part_${i + 1}_value`];
  
        if (type) newElements.push({ type, format, value });
      }
      setElements(newElements);
      console.log(newElements)
    }, [inventory]);
    

  const customTypes = ['line', 'multiline', 'number', 'url', 'bool'];

  const initialValues = {};
  customTypes.forEach(type => {
    for (let i = 1; i <= 3; i++) {
      const stateKey = `custom_${type}${i}_state`;
      const key = `${type}${i}`;
      const mappingEntry = mapping?.find(m => m.stateKey === stateKey);
      if (mappingEntry) {
        initialValues[key] = mappingEntry.value;
      }
    }
  });

  const [formValues, setFormValues] = useState(initialValues);

  if (!inventory) return <p>{t('noInventory')}</p>;

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
        itemData[`custom_${key}`] = value;
      });
      let customId = elements.map(el => {
        if (el.type === 'Sequence') {
          
          return '{SEQ}';
        } else {
          return renderValue(el); 
        }
      }).join('-');

      itemData.custom_id = customId;
      itemData.inventory_id = inventory.id;

      await userService.addItem( {itemData, item_id} );
      
      item_id ? navigate(-2) : navigate(-1);
      
    } catch (error) {
      console.error('Error adding item:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SharedNavbar />
      <Container className="p-5 mt-2">
        {formFields.length === 0 ? (
          <p>No custom fields defined for this inventory.</p>
        ) : (
          <div>
            <h2 className="text-center mb-4">
              Add New Item to Inventory: {inventory.name}
            </h2>
            <Form onSubmit={handleSubmit}>
              {formFields.map(field => {
                if (!field.show) return null;

                let inputElement = null;
                const value = formValues[field.key] ?? '';

                switch (field.type) {
                  case 'line':
                    inputElement = (
                      <Form.Control
                        className={darkMode ? 'textarea-dark' : ''}
                        type="text"
                        value={value}
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
                        value={value}
                        onChange={e => handleChange(field.key, e.target.value)}
                      />
                    );
                    break;
                  case 'number':
                    inputElement = (
                      <Form.Control
                        className={darkMode ? 'textarea-dark' : ''}
                        type="number"
                        value={value}
                        onChange={e => handleChange(field.key, e.target.value)}
                      />
                    );
                    break;
                  case 'url':
                    inputElement = (
                      <Form.Control
                        className={darkMode ? 'textarea-dark' : ''}
                        type="url"
                        value={value}
                        onChange={e => handleChange(field.key, e.target.value)}
                      />
                    );
                    break;
                  case 'bool':
                    inputElement = (
                      <Form.Check
                        type="checkbox"
                        label=""
                        checked={!!formValues[field.key]}
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
                    {field.desc && (
                      <Form.Text className="text-muted">{field.desc}</Form.Text>
                    )}
                  </Form.Group>
                );
              })}

              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Item'}
              </Button>
            </Form>
          </div>
        )}
      </Container>
    </div>
  );
}

export default AddItemsPage;
