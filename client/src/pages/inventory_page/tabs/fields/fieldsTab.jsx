import { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { FIELD_TYPES, MAX_FIELDS, FIELD_TOOLTIPS } from '../constants';
import { defaultNewField } from './components/fieldUtils';
import DraggableField from './components/draggableField';
import { renderFieldInput } from './components/fieldInputRenderer';
import Form from 'react-bootstrap/Form';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../../appContext';

function FieldsTab({ inventory, setInventory, setSaved }) {
  const FIELD_TOOLTIPS = {
  line: "An input for a few words",
  multiline: "An input for a longer text",
  number: "Numeric input",
  url: "URL input",
  bool: "Checkbox input"
};
  const [fields, setFields] = useState([]);
  const scrollContainerRef = useRef(null);
  const { t } = useTranslation();
  const { darkMode } = useAppContext();

  useEffect(() => {
    if (!inventory) return;

    const loadedFields = [];
    const fieldTypes = ["line", "multiline", "number", "url", "bool"];

    fieldTypes.forEach(type => {
      for (let i = 1; i <= 3; i++) {
        if (inventory[`custom_${type}${i}_state`]) {
          loadedFields.push({
            type,
            title: inventory[`custom_${type}${i}_name`] || "",
            desc: inventory[`custom_${type}${i}_desc`] || "",
            showInTable: inventory[`custom_${type}${i}_show`] || false,
          });
        }
      }
    });

    setFields(loadedFields);
  }, [inventory]);

  const updateInventory = (updatedFields) => {
    setFields(updatedFields);

    const updatedInventory = { ...inventory };
    const fieldTypes = ["line", "multiline", "number", "url", "bool"];

    fieldTypes.forEach(type => {
      for (let i = 1; i <= 3; i++) {
        updatedInventory[`custom_${type}${i}_name`] = null;
        updatedInventory[`custom_${type}${i}_desc`] = null;
        updatedInventory[`custom_${type}${i}_show`] = false;
        updatedInventory[`custom_${type}${i}_state`] = false;
      }
    });

    const counters = { line: 1, multiline: 1, number: 1, url: 1, bool: 1 };
    updatedFields.forEach(f => {
      const type = f.type;
      const index = counters[type];
      updatedInventory[`custom_${type}${index}_name`] = f.title;
      updatedInventory[`custom_${type}${index}_desc`] = f.desc;
      updatedInventory[`custom_${type}${index}_show`] = f.showInTable;
      updatedInventory[`custom_${type}${index}_state`] = true;
      counters[type]++;
    });

    setInventory(updatedInventory);
    setSaved(false); 
  };

  const moveField = (from, to) => {
    const updated = [...fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updateInventory(updated);
  };

  const updateField = (index, newData) => {
    const updated = [...fields];
    updated[index] = newData;
    updateInventory(updated);
  };

  const removeField = (index) => {
    updateInventory(fields.filter((_, i) => i !== index));
  };

  const checkLength = (type) => fields.filter(f => f.type === type).length;

  const addField = (type) => {
    if (checkLength(type) < MAX_FIELDS) {
      updateInventory([...fields, defaultNewField(type)]);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-2'>
        <h4 className={darkMode ? 'text-light' : ''}>{t('fieldsHeader')}</h4>
        <p className={darkMode ? 'text-light' : ''}>
          {t('fieldsExplanation', { count: MAX_FIELDS })}
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {FIELD_TYPES.map(type => (
            <OverlayTrigger
              key={type}
              placement="top"
              overlay={
                <Tooltip id={`tooltip${type}`}>
                {checkLength(type) >= MAX_FIELDS
                  ? t('maxElements')
                  : t(FIELD_TOOLTIPS[type])}
              </Tooltip>
              }
            >
              <Button
                disabled={checkLength(type) >= MAX_FIELDS}
                variant={darkMode ? 'outline-light' : 'outline-primary'}
                size="sm"
                onClick={() => addField(type)}
                style={{ pointerEvents: 'auto' }}
              >
                + {type}
              </Button>
            </OverlayTrigger>
          ))}
        </div>

        {fields.length === 0 && (
          <p className={darkMode ? 'text-light' : 'text-muted'}>{t('noElements')}</p>
        )}

        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: darkMode ? '1px solid #555' : '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
            backgroundColor: darkMode ? '#2a2a2a' : '#fff'
          }}
        >
          {fields.map((field, i) => (
            <DraggableField
              key={i}
              field={field}
              index={i}
              moveField={moveField}
              updateField={updateField}
              removeField={removeField}
              scrollContainerRef={scrollContainerRef}
              darkMode={darkMode}
            />
          ))}
        </div>

        <h5 className={`mt-4 ${darkMode ? 'text-light' : ''}`}>{t('previewFields')}</h5>
        <Card className={`p-3 ${darkMode ? 'textarea-dark text-white border-light' : ''}`}>
          {fields.length > 0 ? (
            fields.map((field, i) => (
              <Form.Group key={i} className="mb-3">
                <Form.Label className={darkMode ? 'text-light fw-bold' : 'fw-bold'}>
                  {field.title || '[No title]'}
                </Form.Label>
                {renderFieldInput(field, i, fields, updateInventory, darkMode)}
              </Form.Group>
          ))
          ) : (
            <span className={darkMode ? 'text-light' : 'text-muted'}>{t('noElements')}</span>
          )}
        </Card>
      </div>
    </DndProvider>
  );
}

export default FieldsTab;
