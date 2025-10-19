import { useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { ELEMENT_TYPES, MAX_ELEMENTS, ELEMENT_TOOLTIPS } from '../constants';
import { createNewElement, renderValue } from './components/elementUtils';
import DraggableElement from './components/draggableElement';
import Tooltip from 'react-bootstrap/Tooltip';
import { userService } from '../../../../api/userService';

function IdBuilderTab({ inventory, setInventory }) {
  
  const [elements, setElements] = useState([]);
  const scrollContainerRef = useRef(null);

  const moveElement = (from, to) => {
    const updated = [...elements];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setElements(updated);
  };

  useEffect(() => {
    console.log(inventory)
    if (!inventory?.customID) return;

    const newElements = [];

    for (let i = 0; i < 10; i++) {
      const type = inventory.customID[`part_${i + 1}_type`];
      const format = inventory.customID[`part_${i + 1}_format`];
      const value = inventory.customID[`part_${i + 1}_value`];

      if (type) {
        newElements.push({ type, format, value });
      } else {
        newElements.push(null); 
      }
    }
    const filteredElements = newElements.filter(el => el !== null);

    setElements(filteredElements);
  }, [inventory]);


    const updateElement = (index, key, value) => {
    const updated = [...elements];
    const el = { ...updated[index] };

    el[key] = value;

    if (key === 'format' || key === 'type') {
      el.value = renderValue(el);
    }

    updated[index] = el;
    setElements(updated);
  };


  const removeElement = (index) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const addElement = (type) => {
    setElements([...elements, createNewElement(type)]);
  };

const handleSave = async () => {
  if (!inventory) return;

  const updatedInventory = { ...inventory };

  if (!updatedInventory.customID) updatedInventory.customID = {};
  updatedInventory.customID.inventory_id = updatedInventory.id;

  for (let i = 0; i < 10; i++) {
    const el = elements[i];
    updatedInventory.customID[`part_${i + 1}_type`] = el ? el.type : null;
    updatedInventory.customID[`part_${i + 1}_format`] = el ? el.format : null;
    updatedInventory.customID[`part_${i + 1}_value`] = el ? el.value : null;
  }
  try {
    const response = await userService.saveCustomID(updatedInventory.customID);
    console.log(response.data);
  } catch (err) {
    console.error(err);
  }
  setInventory(updatedInventory);
};

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-2'>
        <h4>ID Builder</h4>
        <p>
          Configure the ID structure by combining elements (max {MAX_ELEMENTS}).<br/>Drag to reorder, click × or drag out to remove.
        </p>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {ELEMENT_TYPES.map((t) => (
            <OverlayTrigger
              key={t}
              placement="top"
              overlay={
                <Tooltip id={`tooltip${t}`}>
                  {elements.length >= MAX_ELEMENTS
                    ? 'Maximum elements reached'
                    : ELEMENT_TOOLTIPS[t]}
                </Tooltip>
              }
            >
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={elements.length >= MAX_ELEMENTS}
                  onClick={() =>
                    elements.length < MAX_ELEMENTS && addElement(t)
                  }
                  style={{ pointerEvents: 'auto' }} 
                >
                  + {t}
                </Button>
            </OverlayTrigger>
          ))}
        </div>
        <Button variant="success" onClick={handleSave}>
            Save Custom ID
        </Button>
        <h5 className="mt-3">Preview ID:</h5>
        <Card className="p-2 mb-3">
          {elements.length > 0 ? (
            elements.map(el => el.value).join('-')
          ) : (
            <span className="text-muted">No ID defined</span>
          )}
        </Card>

        {elements.length === 0 && <p className="text-muted">No elements added yet.</p>}

        <div
          ref={scrollContainerRef}
          style={{
            maxHeight: '40vh',
            overflowY: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          {elements.map((el, i) => (
            <DraggableElement
              key={i}
              element={el}
              index={i}
              moveElement={moveElement}
              updateElement={updateElement}
              removeElement={removeElement}
              scrollContainerRef={scrollContainerRef}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default IdBuilderTab;