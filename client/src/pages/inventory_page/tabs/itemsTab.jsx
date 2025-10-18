import React, { useState, useEffect } from 'react';
import DataTable from '../../components/dataTable';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

function ItemsTab({ inventory, setInventory }) {
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);

  useEffect(() => {

    const baseColumns = [
      {
        key: 'checkbox',
        label: '',
        render: () => <input type="checkbox" />,
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
  }, [inventory]);

  const itemsData = inventory?.items || [];

  return (
    <div>
      <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
        <Button variant="danger" onClick={() => alert("Delete user")} title="Delete">
          <FaTrash color='white' />
        </Button>
        <Button variant="success" onClick={() => navigate('/items')} title="Create New Item">
          <FaPlus color='white' />
        </Button>
      </div>

      <h4>Items</h4>
      <DataTable data={itemsData} columns={columns} />
    </div>
  );
}

export default ItemsTab;
