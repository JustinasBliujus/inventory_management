import { useState, useRef } from 'react';
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

function FieldsTab() {
  const [fields, setFields] = useState([]);
  const scrollContainerRef = useRef(null);

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
          style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '8px' }}
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
            />
          ))}
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
      </div>
    </DndProvider>
  );
}

export default FieldsTab;
