import { useDrag, useDrop } from 'react-dnd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import '../../../../components/darkMode.css'

function DraggableField({ field, index, moveField, updateField, removeField, scrollContainerRef, darkMode }) {
  const [, dropRef] = useDrop({
    accept: 'field',
    hover: (item, monitor) => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const clientOffset = monitor.getClientOffset();
      const boundingRect = container.getBoundingClientRect();

      const scrollMargin = 80;
      const scrollSpeed = 5;

      if (clientOffset.y < boundingRect.top + scrollMargin) container.scrollTop -= scrollSpeed;
      else if (clientOffset.y > boundingRect.bottom - scrollMargin) container.scrollTop += scrollSpeed;
    },
    drop: (item) => {
      if (item.index !== index) {
        moveField(item.index, index);
        item.index = index;
      }
    },
  });

  const [, dragRef] = useDrag({
    type: 'field',
    item: { index },
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        const clientOffset = monitor.getClientOffset();
        const container = scrollContainerRef.current;
        if (clientOffset && container) {
          const boundingRect = container.getBoundingClientRect();
          const isOutside =
            clientOffset.x < boundingRect.left ||
            clientOffset.x > boundingRect.right ||
            clientOffset.y < boundingRect.top ||
            clientOffset.y > boundingRect.bottom;

          if (isOutside) removeField(item.index);
        }
      }
    },
  });

  const ref = (node) => dragRef(dropRef(node));

  const handleChange = (key, value) => updateField(index, { ...field, [key]: value });

  return (
    <Card
      ref={ref}
      className={`p-2 my-2 d-flex flex-column ${darkMode ? 'textarea-dark' : ''}`}
    >
      <div className="d-flex justify-content-between align-items-center">
        <strong>{field.type}</strong>
        <Button variant={darkMode ? 'outline-light' : 'outline-danger'} size="sm" onClick={() => removeField(index)}>×</Button>
      </div>

      <Form.Control
        placeholder="Title"
        value={field.title}
        onChange={(e) => handleChange('title', e.target.value)}
        disabled={field.editable === false}
        className={`${darkMode ? 'bg-dark-placeholder bg-dark text-white border-secondary mt-2' : 'bg-light-placeholder mt-2'}`}
      />

      <Form.Control
        placeholder="Description"
        value={field.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
        className={`${darkMode ? 'bg-dark-placeholder bg-dark text-white border-secondary mt-2' : 'bg-light-placeholder mt-2'}`}
      />

      <Form.Check
        className="mt-2"
        type="checkbox"
        label="Show in table"
        checked={field.showInTable}
        onChange={(e) => handleChange('showInTable', e.target.checked)}
        style={{ color: darkMode ? 'white' : undefined }}
      />
    </Card>
  );
}

export default DraggableField;
