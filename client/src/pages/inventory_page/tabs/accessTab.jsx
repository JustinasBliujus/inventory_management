import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaTrash, FaPlus, FaSave } from 'react-icons/fa';
import DataTable from '../../components/dataTable';

function AccessTab({ inventory, setInventory }) {
  const [isPublic, setIsPublic] = useState(false);
  const [editors, setEditors] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  useEffect(() => {
    if (!inventory) return;
    setSelectAll(false);
    setIsPublic(inventory.is_public || false);

    if (inventory.editors && Array.isArray(inventory.editors)) {
      const mappedEditors = inventory.editors.map(editor => ({
        name: editor.name,
        email: editor.email,
        selected: false, 
      }));
      setEditors(mappedEditors);
    }
  }, [inventory]);

  const handleAddEditor = () => {
    setEditors(prev => [
      ...prev,
      { name: "test", email: `test${editors.length}@gmail.com`, selected: false }
    ]);
  };

  const handleRemoveSelected = () => {
    setEditors(prev => prev.filter(editor => !editor.selected));
    setSelectAll(false);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setEditors(editors.map(editor => ({ ...editor, selected: newSelectAll })));
  };

  const handleSelectRow = (email) => {
    setEditors(editors.map(editor => editor.email === email ? { ...editor, selected: !editor.selected } : editor));
  };

  const handleSave = () => {
    const editorsWithoutSelected = editors.map(editor => ({
        name: editor.name,
        email: editor.email,
    }))

    const updatedInventory = {
      ...inventory,
      is_public: isPublic,
      editors: editorsWithoutSelected
    };
    setInventory(updatedInventory);
    console.log('Updated inventory:', updatedInventory);
  };

  const columns = [
    {
        key: 'select',
        label: '', 
        render: (_, row) => (
        <Form.Check
            type="checkbox"
            checked={row.selected}
            onChange={() => handleSelectRow(row.email)}
        />
        ),
        header: (
        <Form.Check
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
        />
        )
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (value, row) => (
        <a href={`/personal/${row.name}`} style={{ textDecoration: 'none' }}>
          {value}
        </a>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
    },
  ];

  return (
    <div>
      {/* Public/Private toggle */}
      <div className="d-flex align-items-center gap-4 mb-3">
        <h4 className="mb-0">
          Accessibility: {isPublic ? 'Public' : 'Private'}
        </h4>
        <Form.Check
          style={{ transform: 'scale(1.5)' }}
          type="switch"
          id="public-switch"
          checked={isPublic}
          onChange={() => setIsPublic(prev => !prev)}
        />
      </div>

      {/* Action buttons */}
      <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
        <Button variant="danger" onClick={handleRemoveSelected}>
          <FaTrash color="white" /> Remove
        </Button>
        <Button variant="success" onClick={handleAddEditor}>
          <FaPlus color="white" /> Add Editor
        </Button>
      </div>

      {/* Editors table */}
      <h4>Editors with Access</h4>
      <DataTable
        data={editors}
        columns={columns}
        itemsPerPage={5}
        onRowClick={(row) => console.log('Clicked:', row)}
      />

      {/* Save button */}
      <div className="mt-3 text-end">
        <Button variant="primary" onClick={handleSave}>
          <FaSave className="me-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
}

export default AccessTab;
