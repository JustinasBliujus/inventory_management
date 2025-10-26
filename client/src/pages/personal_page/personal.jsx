import SharedNavbar from '../components/navbar';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import DataTable from '../components/dataTable'; 
import { Container } from 'react-bootstrap';
import { userService } from '../../api/userService';
import { useTranslation } from 'react-i18next';
import { useAppContext  } from '../../appContext';

function PersonalPage() {
    const location = useLocation();
    const { userId, name } = location.state || {};
    const { darkMode, user } = useAppContext();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [inventories, setInventories] = useState([]);
    const [editableInventories, setEditableInventories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [error, setError] = useState(location.state?.error?.message || "");
    const [success, setSuccess] = useState(location.state?.success?.message || "");
    const isPersonal = user.id === userId;

    useEffect(() => {
        const fetchInventories = async () => {

            setError("");
            try {
               
                try {
                    const personalRes = await userService.getUsersInventories(userId);
                    const personalSimplified = personalRes.data.inventories.map(inv => ({
                        ...inv,
                        id: inv.id,
                        name: inv.name,
                        description: inv.description,
                        publicity: inv.is_public ? "Public" : "Private",
                        created: inv.createdAt,
                        selected: false
                    }));
                    setInventories(personalSimplified);
                } catch (err) {
                    console.error("Error fetching personal inventories:", err);
                    setError("Failed to load personal inventories.");
                }
                
                try {
                    const editableRes = await userService.getEditableInventories(userId);
                    console.log(editableRes)
                    const editableSimplified = editableRes.data.inventories.map(inv => ({
                        ...inv,
                        id: inv.id,
                        name: inv.name,
                        description: inv.description,
                        publicity: inv.is_public ? "Public" : "Private",
                        owner: inv.creatorEmail,
                        created: inv.createdAt
                    }));
                    setEditableInventories(editableSimplified);
                } catch (err) {
                    console.error("Error fetching editable inventories:", err);
                    setError("Failed to load accessible inventories.");
                }

            } catch (err) {
                console.error("Unexpected error fetching inventories:", err);
                setError("Unexpected error occurred while fetching inventories.");
            }
        };

        fetchInventories();
    }, [userId]);


    const handleCreateInventory = async () => {
        try {
            const response = await userService.createInventory({ name: "New Inventory", customID: "" });
            navigate('/inventory', { state: response.data.inventoryId });
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Creation failed!");
        }
    };

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setInventories(prev => prev.map(inv => ({ ...inv, selected: newSelectAll })));
    };

    const handleSelectRow = (row) => {
        setInventories(prev => {
            const updated = prev.map(inv =>
                inv === row ? { ...inv, selected: !inv.selected } : inv
            );
            setSelectAll(updated.every(inv => inv.selected));
            return updated;
        });
    };

    const handleDeleteSelected = async () => {
        const selected = inventories.filter(inv => inv.selected);
        if (selected.length === 0) {
            setError("No inventories selected");
            return;
        }

        try {
            await Promise.all(
                selected.map(inv => userService.deleteInventory(inv.id))
            );

            setInventories(prev => prev.filter(inv => !inv.selected));
            setSelectAll(false);
            setSuccess(`${selected.length} inventory(s) deleted successfully.`);
        } catch (err) {
            setError(err);
            console.error("Error deleting inventories:", err);
        }
    };


    const personalColumns = [
    {
        key: 'checkbox',
        label: (
            <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
            />
        ),
        render: (_, row) => (
            <input
                type="checkbox"
                checked={row.selected || false}
                onChange={() => handleSelectRow(row)}
            />
        )
    },
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (value, row) => (
            <span
                style={{ cursor: 'pointer', color: '#0d6efd', }}
                onClick={() => navigate('/inventory', { state: row.id })}
            >
                {value}
            </span>
        )
    },
    { key: 'description', label: 'Description', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'publicity', label: 'Publicity', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'created', label: 'Created', sortable: true, className: 'd-none d-sm-table-cell' }
];


    const accessColumns = [
        { 
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (value, row) => (
            <span
                style={{ cursor: 'pointer', color: '#0d6efd', }}
                onClick={() => navigate('/inventory', { state: row.id })}
            >
                {value}
            </span>
        )
        },
        { key: 'description', label: 'Description', sortable: true, className: 'd-none d-sm-table-cell' },
        { key: 'publicity', label: 'Publicity', sortable: true, className: 'd-none d-sm-table-cell' },
        { 
            key: 'owner',
            label: 'Owner',
            sortable: true, 
            render: (value, row) => (
                console.log('Render value:', value, 'Row:', row),
                <span
                className="text-decoration-none d-none d-sm-table-cell"
                style={{ cursor: 'pointer', color: 'blue' }}
                onClick={() => navigate('/personal', { state: { userId: row.user_id, name: row.email } })}
                >
                {value}
                </span>
            ) 
        },
        { key: 'created', label: 'Created', sortable: true, className: 'd-none d-sm-table-cell' }
    ];

    return (
        <div>
        <SharedNavbar />
        <Container className="mt-5 p-5">
            <div className="mb-5">

                {error && (<div className="alert alert-danger" role="alert">
                    {error}
                </div>)}

                {success && (<div className="alert alert-success" role="alert">
                    {success}
                </div>)}

                <p className="fs-1">
                    {isPersonal
                        ? t('yourInventories')
                        : t('usersInventories', { name })}
                </p>

                <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                    <Button variant="danger" onClick={handleDeleteSelected} title={t('deleteSelected')}>
                        <FaTrash color='white' />
                    </Button>
                    <Button variant="success" onClick={handleCreateInventory} title={t('createNewInventory')}>
                        <FaPlus color='white' />
                    </Button>
                </div>
                <DataTable data={inventories} columns={personalColumns} itemsPerPage={5} darkMode={darkMode} />
            </div>

            <div>
                <p className="fs-1">
                    {isPersonal
                        ? t('yourAccessibleInventories')
                        : t('userAccessibleInventories', { name })}
                </p>

                <DataTable data={editableInventories} columns={accessColumns} itemsPerPage={5} darkMode={darkMode}/>
            </div>
        </Container>
        </div>
    );
}

export default PersonalPage;
