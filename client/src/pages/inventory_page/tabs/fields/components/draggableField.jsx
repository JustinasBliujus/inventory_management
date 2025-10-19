import { useDrag, useDrop } from 'react-dnd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function DraggableField({ field, index, moveField, updateField, removeField, scrollContainerRef }) {
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

          if (isOutside) {
            removeField(item.index);
          }
        }
      }
    },
  });

  const ref = (node) => dragRef(dropRef(node));

  const handleChange = (key, value) => updateField(index, { ...field, [key]: value });

  return (
    <Card ref={ref} className="p-2 my-2 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center">
        <strong>{field.type}</strong>
        <Button variant="outline-danger" size="sm" onClick={() => removeField(index)}>×</Button>
      </div>

      <Form.Control
        className="mt-2"
        placeholder="Title"
        value={field.title}
        onChange={(e) => handleChange('title', e.target.value)}
        disabled={field.editable === false}
      />

      <Form.Control
        className="mt-2"
        placeholder="Description"
        value={field.desc}
        onChange={(e) => handleChange('desc', e.target.value)}
      />

      <Form.Check
        className="mt-2"
        type="checkbox"
        label="Show in table"
        checked={field.showInTable}
        onChange={(e) => handleChange('showInTable', e.target.checked)}
      />
    </Card>
  );
}

export default DraggableField;
