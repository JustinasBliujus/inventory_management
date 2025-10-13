import { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { ELEMENT_TYPES, MAX_ELEMENTS, ELEMENT_TOOLTIPS } from '../constants';
import { defaultNewElement } from './components/elementUtils';
import { renderPreview } from './components/renderPreview';
import DraggableElement from './components/draggableElement';
import Tooltip from 'react-bootstrap/Tooltip';

function IdBuilderTab() {
  const [elements, setElements] = useState([]);
  const scrollContainerRef = useRef(null);

  const moveElement = (from, to) => {
    const updated = [...elements];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setElements(updated);
  };

  const updateElement = (index, newData) => {
    const updated = [...elements];
    updated[index] = newData;
    setElements(updated);
  };

  const removeElement = (index) => {
    setElements(elements.filter((_, i) => i !== index));
  };

  const addElement = (type) => {
    setElements([...elements, defaultNewElement(type)]);
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
        
        <h5 className="mt-4">Preview ID:</h5>
        <Card className="p-2 mb-3">
          {elements.map(renderPreview).join('-') || (
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
