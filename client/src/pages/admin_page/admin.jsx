import React, { useState, useEffect } from 'react';
import DataTable from '../components/dataTable';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function ItemsTab({ inventory, setInventory }) {
  const navigate = useNavigate();

  const [itemsData, setItemsData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [columns, setColumns] = useState([]);

  // Initialize items and add 'selected' state
  useEffect(() => {
    if (inventory?.items) {
      const itemsWithSelection = inventory.items.map(item => ({
        ...item,
        selected: false,
      }));
      setItemsData(itemsWithSelection);
      setSelectAll(false);
    }
  }, [inventory]);

  // Build columns dynamically whenever inventory changes
  useEffect(() => {
    const baseColumns = [
      {
        key: 'select',
        label: '',
        render: (_, row) => (
          <Form.Check
            type="checkbox"
            checked={row.selected || false}
            onChange={() => handleSelectRow(row)}
          />
        ),
        header: (
          <Form.Check
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
          />
        ),
      },
    ];

    const customColumns = [];
    if (inventory) {
      const customTypes = ['line', 'multiline', 'number', 'url', 'bool'];
      for (let type of customTypes) {
        for (let i = 1; i <= 3; i++) {
          const showKey = `custom_${type}${i}_show`;
          const nameKey = `custom_${type}${i}_name`;
          if (inventory[showKey]) {
            customColumns.push({
              key: `${type}${i}`,
              label: inventory[nameKey] || `Custom ${type} ${i}`,
              render: (value, row) => row[`${type}${i}`] ?? '',
            });
          }
        }
      }
    }

    setColumns([...baseColumns, ...customColumns]);
  }, [inventory, selectAll]);

  // Toggle header selectAll
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItemsData(prev =>
      prev.map(item => ({ ...item, selected: newSelectAll }))
    );
  };

  // Toggle individual row selection
  const handleSelectRow = (row) => {
    setItemsData(prev =>
      prev.map(item =>
        item === row ? { ...item, selected: !item.selected } : item
      )
    );
    // Update header checkbox if all are selected
    const allSelected =
      itemsData.every(item => item.selected) && !row.selected;
    setSelectAll(allSelected);
  };

  return (
    <div>
      <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
        <Button
          variant="danger"
          onClick={() => alert("Delete selected items")}
          title="Delete"
        >
          <FaTrash color='white' />
        </Button>
        <Button
          variant="success"
          onClick={() => navigate('/items')}
          title="Create New Item"
        >
          <FaPlus color='white' />
        </Button>
      </div>

      <h4>Items</h4>
      <DataTable data={itemsData} columns={columns} />
    </div>
  );
}

export default ItemsTab;
