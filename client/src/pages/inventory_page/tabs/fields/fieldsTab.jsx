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

function FieldsTab({ inventory, setInventory }) {
  const [fields, setFields] = useState([]);
  const scrollContainerRef = useRef(null);

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

  const moveField = (from, to) => {
    const updated = [...fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setFields(updated);
  };

  const updateField = (index, newData) => {
    const updated = [...fields];
    updated[index] = newData;
    setFields(updated);
  };

  const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const checkLength = (type) => fields.filter(f => f.type === type).length;

  const addField = (type) => {
    if (checkLength(type) < MAX_FIELDS) {
      setFields([...fields, defaultNewField(type)]);
    }
  };

  const handleSave = () => {
    if (!inventory) return;

    const payload = fields.map(f => ({
      type: f.type,
      title: f.title,
      desc: f.desc,
      showInTable: f.showInTable,
    }));

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

    payload.forEach(f => {
      const type = f.type;
      const index = counters[type];
      updatedInventory[`custom_${type}${index}_name`] = f.title;
      updatedInventory[`custom_${type}${index}_desc`] = f.desc;
      updatedInventory[`custom_${type}${index}_show`] = f.showInTable;
      updatedInventory[`custom_${type}${index}_state`] = true;
      counters[type]++;
    });

    setInventory(updatedInventory);
    console.log("Updated inventory:", updatedInventory);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-2'>
        <h4>Configure custom fields</h4>
        <p>
          You can choose up to {MAX_FIELDS} fields of each type.<br/>Drag to reorder, click × or drag out to remove.
        </p>

        <div className="d-flex flex-wrap gap-2 mb-3">
          {FIELD_TYPES.map(type => (
            <OverlayTrigger
              key={type}
              placement="top"
              overlay={
                <Tooltip id={`tooltip${type}`}>
                  {checkLength(type) >= MAX_FIELDS
                    ? 'Maximum elements reached'
                    : FIELD_TOOLTIPS[type]}
                </Tooltip>
              }
            >
              <Button
                key={type}
                disabled={checkLength(type) >= MAX_FIELDS}
                variant="outline-primary"
                size="sm"
                onClick={() => addField(type)}
                style={{ pointerEvents: 'auto' }}
              >
                + {type}
              </Button>
            </OverlayTrigger>
          ))}
        </div>

        {fields.length === 0 && <p className="text-muted">No Fields added yet.</p>}

        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px'
          }}
        >
          {fields.map((field, i) => {
            return (
              <DraggableField
                key={i}
                field={field}
                index={i}
                moveField={moveField}
                updateField={updateField}
                removeField={removeField}
                scrollContainerRef={scrollContainerRef}
              />
            );
          })}

        </div>

        <h5 className="mt-4">Preview Form:</h5>
        <Card className="p-3">
          {fields.length > 0 ? (
            fields.map((field, i) => (
              <Form.Group key={i} className="mb-3">
                <Form.Label className="fw-bold">
                  {field.title || '[No title]'}
                </Form.Label>
                {renderFieldInput(field, i, fields, setFields)}
              </Form.Group>
            ))
          ) : (
            <span className="text-muted">No Fields defined</span>
          )}
        </Card>

        <div className="mt-3 text-end">
          <Button variant="success" onClick={handleSave}>
            Save Fields
          </Button>
        </div>
      </div>
    </DndProvider>
  );
}

export default FieldsTab;
