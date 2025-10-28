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
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../../appContext';
import '../../../components/darkMode.css'

function IdBuilderTab({ inventory, setInventory, setSaved }) {
  const { t } = useTranslation();
  const { darkMode } = useAppContext();

  const [elements, setElements] = useState([]);
  const scrollContainerRef = useRef(null);

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

  }, [inventory]);

  const updateInventory = (updatedElements) => {
    setElements(updatedElements);

    const updatedInventory = { ...inventory };
    if (!updatedInventory.customID) updatedInventory.customID = {};
    updatedInventory.customID.inventory_id = updatedInventory.id;

    for (let i = 0; i < 10; i++) {
      const el = updatedElements[i];
      updatedInventory.customID[`part_${i + 1}_type`] = el ? el.type : null;
      updatedInventory.customID[`part_${i + 1}_format`] = el ? el.format : null;
      updatedInventory.customID[`part_${i + 1}_value`] = el ? el.value : null;
    }

    setInventory(updatedInventory);
    setSaved(false); 
  };

  const moveElement = (from, to) => {
    const updated = [...elements];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    updateInventory(updated);
  };

  const updateElement = (index, key, value) => {
    const updated = [...elements];
    const el = { ...updated[index] };
    el[key] = value;

    if (key === 'format' || key === 'type') {
      el.value = renderValue(el);
    }

    updated[index] = el;
    updateInventory(updated);
  };

  const removeElement = (index) => {
    updateInventory(elements.filter((_, i) => i !== index));
  };

  const addElement = (type) => {
    updateInventory([...elements, createNewElement(type)]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='p-2'>
        <h4>{t('idBuilder')}</h4>
        <p>{t('idBuilderExplanation', { count: MAX_ELEMENTS })}</p>
        <p>{t('customIdExplanation')}</p>
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
                variant={darkMode ? 'outline-light' : 'outline-primary'}
                size="sm"
                disabled={elements.length >= MAX_ELEMENTS}
                onClick={() => elements.length < MAX_ELEMENTS && addElement(t)}
              >
                + {t}
              </Button>
            </OverlayTrigger>
          ))}
        </div>

        <h5 className="mt-3">{t('previewId')}</h5>
        <Card className={`p-2 mb-3 ${darkMode ? 'textarea-dark' : ''}`}>
          {elements.length > 0
            ? elements.map(el => el.value).join('-')
            : <span>{t('noId')}</span>}
        </Card>

        {elements.length === 0 && <p className="text-muted">{t('noElements')}</p>}

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
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default IdBuilderTab;
