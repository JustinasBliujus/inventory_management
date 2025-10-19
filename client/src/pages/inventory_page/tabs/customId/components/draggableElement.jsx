import { useDrag, useDrop } from 'react-dnd';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function DraggableElement({
  element,
  index,
  moveElement,
  updateElement,
  removeElement,
  scrollContainerRef,
}) {
  const [, dropRef] = useDrop({
    accept: 'element',
    hover: (item, monitor) => {
      if (!scrollContainerRef.current) return;
      const container = scrollContainerRef.current;
      const clientOffset = monitor.getClientOffset();
      const boundingRect = container.getBoundingClientRect();

      const scrollMargin = 80;
      const scrollSpeed = 5;

      if (clientOffset.y < boundingRect.top + scrollMargin) {
        container.scrollTop -= scrollSpeed;
      } else if (clientOffset.y > boundingRect.bottom - scrollMargin) {
        container.scrollTop += scrollSpeed;
      }
    },
    drop: (item) => {
      if (item.index !== index) {
        moveElement(item.index, index);
        item.index = index;
      }
    },
  });

  const [, dragRef] = useDrag({
    type: 'element',
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
            removeElement(item.index);
          }
        }
      }
    },
  });

  const ref = (node) => dragRef(dropRef(node));

  const handleChange = (key, value) => {
    updateElement(index, key, value);
  };

  return (
    <Card ref={ref} className="p-2 my-2 d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center">
        <strong>{element.type}</strong>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => removeElement(index)}
        >
          ×
        </Button>
      </div>

      {element.type === 'Fixed text' && (
        <Form.Control
          className="mt-2"
          placeholder="Enter fixed text"
          value={element.value || ''}
          onChange={(e) => handleChange('value', e.target.value)}
        />
      )}

      {['20-bit random number', '32-bit random number'].includes(element.type) && (
        <Form.Group className="mt-2">
          <Form.Label>Value</Form.Label>
        </Form.Group>
      )}

      {['20-bit random number', '32-bit random number'].includes(element.type) && (
        <Form.Group className="mt-2">
          <Form.Label>Format</Form.Label>
          <Form.Select
            value={element.format}
            onChange={(e) => handleChange('format', e.target.value)}
          >
            <option value="decimal">Decimal</option>
            <option value="hex">Hexadecimal</option>
          </Form.Select>
        </Form.Group>
      )}

      {element.type === 'Date/time' && (
        <Form.Group className="mt-2">
          <Form.Label>Date Format</Form.Label>
          <Form.Select
            value={element.format}
            onChange={(e) => handleChange('format', e.target.value)}
          >
            <option value="YYYY">Year only</option>
            <option value="MM">Month only</option>
            <option value="DD">Day only</option>
            <option value="YYYY-MM">Year-Month</option>
            <option value="YYYY-MM-DD">Year-Month-Day</option>
          </Form.Select>
        </Form.Group>
      )}
    </Card>
  );
}

export default DraggableElement;