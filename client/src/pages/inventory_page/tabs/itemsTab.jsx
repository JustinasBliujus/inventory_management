import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Alert } from 'react-bootstrap';
import DataTable from '../../components/dataTable';
import { userService } from '../../../api/userService';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../appContext';
import { Link } from 'react-router-dom';

function InventoryItems({ inventory }) {
  const { darkMode, user } = useAppContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isAdmin = user?.is_admin === true;
  const isOwner = (user?.id && inventory?.user_id && user.id === inventory.user_id && user?.status === 'verified') || isAdmin;
  const hasWriteAccess = (isOwner || inventory?.is_public || (inventory?.editors?.find(e => e.email === user.email) !== undefined)) && user?.status === 'verified';

  useEffect(() => {
    if (inventory?.items) {
      const mappedItems = inventory.items.map(item => ({
        ...item,
        selected: false
      }));
      setItems(mappedItems);
      setSelectAll(false);
    }
  }, [inventory]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setItems(items.map(item => ({ ...item, selected: newSelectAll })));
  };

  const handleSelectRow = (id) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setItems(updatedItems);
    setSelectAll(updatedItems.every(item => item.selected));
  };

  const handleDeleteItems = async () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length === 0) {
      setError("Please select at least one item to delete.");
      return;
    }

    try {
      setError(null);
      await Promise.all(
        selectedItems.map(item =>
          userService.deleteitem(item.id, item.inventory_id, inventory.user_id)
        )
      );

      setSuccess(`${selectedItems.length} item(s) deleted successfully`);
      setItems(items.filter(item => !item.selected));
      setSelectAll(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete items.");
      console.error(err);
    }
  };

  const customTypes = ['line', 'multiline', 'number', 'url', 'bool'];
  const customColumns = [];

  customTypes.forEach(type => {
    for (let i = 1; i <= 3; i++) {
      const showKey = `custom_${type}${i}_show`;
      const nameKey = `custom_${type}${i}_name`;
      const stateKey = `custom_${type}${i}_state`;

      if (inventory[showKey] && inventory[stateKey]) {
        customColumns.push({
          key: `custom_${type}${i}`, 
          label: inventory[nameKey] || `${type} ${i}`,
          render: (_, row) => {
            const cellValue = row[`custom_${type}${i}`];
            if (type === 'bool') return cellValue ? 'Yes' : 'No';
            return cellValue ?? '-';
          },
          sortable: true
        });

        
      }
    }
  });

  const columns = [
    {
      key: 'select',
      label: <Form.Check type="checkbox" disabled={!hasWriteAccess} checked={selectAll} onChange={handleSelectAll}/>,
      render: (_, row) => <Form.Check disabled={!hasWriteAccess} type="checkbox" checked={row.selected} onChange={() => handleSelectRow(row.id)} />
    },
    { 
      key: 'id', 
      label: 'Item ID', 
      sortable: true,
      render: (value, row) => (
        <Link
          to="/item"
          state={{ item_id: row.id, inventory: inventory }}
          className="text-decoration-none"
          style={{ whiteSpace: 'nowrap' }}
        >
          {value}
        </Link>
      ) 
    },
    {
      key: 'creator_email',
      label: 'Creator Email',
      sortable: true,
      render: (value, row) => (
        <Link
          to="/personal"
          state={{ email: row.creator_email }}
          className="text-decoration-none"
        >
          {value}
        </Link>
      )
    },
    ...customColumns,
    { key: 'createdAt', label: 'Created At', sortable: true, render: (value) => new Date(value).toLocaleString() },
    { key: 'updatedAt', label: 'Updated At', sortable: true, render: (value) => new Date(value).toLocaleString() },
  ];

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <h4>{t('items')}</h4>

      {
        hasWriteAccess && (
          <div className="d-flex justify-content-start gap-2 mb-3">
            <Button
              variant="danger"
              onClick={handleDeleteItems}
              disabled={!hasWriteAccess}
              title={hasWriteAccess ? t('deleteSelected') : t('noWriteAccess')}
            >
              <FaTrash color='white' />
            </Button>
            <Button
              disabled={!hasWriteAccess}
              title={hasWriteAccess ? t('addNewItem') : t('noWriteAccess')}
              variant="success"
              onClick={() => navigate('/addItem', { state: { inventory } })}
            >
              <FaPlus color='white' />
            </Button>
          </div>
        )
      }

      <DataTable data={items} columns={columns} itemsPerPage={5} darkMode={darkMode} />
    </div>
  );
}

export default InventoryItems;
