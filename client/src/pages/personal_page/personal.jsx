import SharedNavbar from '../components/navbar';
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/dataTable'; 
import { Container } from 'react-bootstrap';
import { userService } from '../../api/userService';

function PersonalPage() {
    const navigate = useNavigate();
    const [inventories, setInventories] = useState([]);
    const [editableInventories, setEditableInventories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [error, setError] = useState(location.state?.error?.message || "");
    const [success, setSuccess] = useState(location.state?.success?.message || "");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [personalRes, editableRes] = await Promise.all([
                    userService.getUsersInventories(),
                    userService.getEditableInventories()
                ]);

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

                const editableSimplified = editableRes.data.inventories.map(inv => ({
                    name: inv.name,
                    description: inv.description,
                    publicity: inv.is_public ? "Public" : "Private",
                    owner: inv.creatorEmail,
                    created: inv.createdAt
                }));
                setEditableInventories(editableSimplified);

            } catch (err) {
                console.error("Error fetching inventories:", err);
            }
        };
        fetchData();
    }, []);

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
        { key: 'name', label: 'Name', sortable: true, render: (value) => <a style={{ textDecoration: 'none' }} href='/inventory'>{value}</a> },
        { key: 'description', label: 'Description', sortable: true, className: 'd-none d-sm-table-cell' },
        { key: 'publicity', label: 'Publicity', sortable: true, className: 'd-none d-sm-table-cell' },
        { key: 'owner', label: 'Owner', sortable: true, render: (value) => <a href='/personal'>{value}</a> },
        { key: 'created', label: 'Created', sortable: true, className: 'd-none d-sm-table-cell' }
    ];

    return (
        <Container className="mt-5 p-5">
            <SharedNavbar />
            <div className="mb-5">

                {error && (<div className="alert alert-danger" role="alert">
                    {error}
                </div>)}

                {success && (<div className="alert alert-success" role="alert">
                    {success}
                </div>)}

                <p className="fs-1">Your Inventories</p>
                {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                    <Button variant="danger" onClick={handleDeleteSelected} title="Delete Selected">
                        <FaTrash color='white' />
                    </Button>
                    <Button variant="success" onClick={handleCreateInventory} title="Create New Inventory">
                        <FaPlus color='white' />
                    </Button>
                </div>
                <DataTable data={inventories} columns={personalColumns} itemsPerPage={5} />
            </div>

            <div>
                <p className="fs-1">You have access to</p>
                <DataTable data={editableInventories} columns={accessColumns} itemsPerPage={5} />
            </div>
        </Container>
    );
}

export default PersonalPage;
