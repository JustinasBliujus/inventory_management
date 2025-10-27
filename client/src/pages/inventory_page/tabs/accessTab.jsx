import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaTrash } from 'react-icons/fa';
import DataTable from '../../components/dataTable';
import { userService } from '../../../api/userService';
import { useTranslation } from 'react-i18next';
import '../../components/darkMode.css'
import { useAppContext } from '../../../appContext';
import { useNavigate } from 'react-router-dom';

function AccessTab({ inventory, setInventory, setSaved }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isPublic, setIsPublic] = useState(false);
  const [editors, setEditors] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);
  const { darkMode } = useAppContext();

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

  useEffect(() => {
    if (!emailInput.trim()) {
      setSearchResults([]);
      return;
    }

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await userService.searchUsersByEmail(emailInput);
        if (res.data.success) setSearchResults(res.data.users);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(searchTimeout.current);
  }, [emailInput]);

  const updateInventory = (updatedEditors, updatedIsPublic = isPublic) => {
    const updatedInventory = {
      ...inventory,
      is_public: updatedIsPublic,
      editors: updatedEditors.map(e => ({ name: e.name, email: e.email })),
    };
    setInventory(updatedInventory);
    setSaved(false); 
  };

  const handleAddEditor = (user) => {
    if (!user || editors.some(e => e.email === user.email)) return;

    const updatedEditors = [...editors, { name: user.name, email: user.email, selected: false }];
    updateInventory(updatedEditors);
    setEmailInput('');
    setSearchResults([]);
  };

  const handleRemoveSelected = () => {
    const updatedEditors = editors.filter(editor => !editor.selected);
    updateInventory(updatedEditors);
    setSelectAll(false);
  };

  const handleSelectRow = (email) => {
    setEditors(editors.map(editor =>
      editor.email === email ? { ...editor, selected: !editor.selected } : editor
    ));
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setEditors(editors.map(editor => ({ ...editor, selected: newSelectAll })));
  };

  const handleTogglePublic = () => {
    updateInventory(editors, !isPublic);
    setIsPublic(prev => !prev);
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
                <span
                className="text-decoration-none d-none d-sm-table-cell"
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => navigate('/personal', { state: { email: row.email } })}
                >
                {value}
                </span>
            ) 
    },
    { key: 'email', header: 'Email', sortable: true },
  ];

  return (
    <div>
      <div className="d-flex align-items-center gap-4 mb-3">
        <h4 className="mb-0">{t('accessibility')}: {isPublic ? t('public') : t('private')}</h4>
        <Form.Check
          style={{ transform: 'scale(1.5)' }}
          type="switch"
          id="public-switch"
          checked={isPublic}
          onChange={handleTogglePublic}
        />
      </div>

      <div className="d-flex gap-2 mb-3 mt-2 flex-wrap align-items-start position-relative">
        <Form.Control
          type="email"
          placeholder={t('searchUser')}
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          style={{ maxWidth: '300px' }}
          className={darkMode ? 'textarea-dark' : ''}
        />

        {searchResults.length > 0 && (
          <div className="border position-absolute bg-white" style={{ top: '100%', left: 0, zIndex: 1000, maxHeight: '200px', overflowY: 'auto', width: '300px' }}>
            {searchResults.map(user => (
              <Button
                key={user.email}
                className="dropdown-item text-start"
                onClick={() => handleAddEditor(user)}
              >
                {user.name} ({user.email})
              </Button>
            ))}
          </div>
        )}

      </div>

      <h4>{t('editorsWithAccess')}</h4>
      <Button className='mb-2' variant="danger" onClick={handleRemoveSelected}>
        <FaTrash color="white" />
      </Button>
      <DataTable
        data={editors}
        columns={columns}
        itemsPerPage={5}
        darkMode={darkMode}
      />
    </div>
  );
}

export default AccessTab;
