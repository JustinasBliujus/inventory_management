import SharedNavbar from '../components/navbar';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/dataTable'; 
import Dropdown from 'react-bootstrap/Dropdown';
import { Container } from 'react-bootstrap';
import { userService } from '../../api/userService';

function PersonalPage() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [filter, setFilter] = useState(null);

    const handlePublicityClick = (value) => {
        setFilter(value);
    };

    const handleCreateInventory = async () => {
    try {
        const data = {
            name: "New Inventory",
            customID: "",
            description: "",
            customFields: {}  
        };

        const response = await userService.createInventory({
            name: data.name,
            customID: data.customID,
        });

        console.log("INVNETORY IDDD " +response.data.inventoryId)

        navigate('/inventory', { state: response.data.inventoryId });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Creation failed!");
    }
    };

    const data = [
        { name: "Golfing", description: "Best golf sticks", items: 32, created: 2022 },
        { name: "Tennis", description: "High-quality tennis rackets", items: 20, created: 2021 },
        { name: "Basketball", description: "Professional basketballs", items: 50, created: 2023 },
        { name: "Swimming", description: "Premium swimwear and goggles", items: 40, created: 2020 },
        { name: "Cycling", description: "Mountain and road bikes", items: 15, created: 2022 },
        { name: "Running", description: "Comfortable running shoes", items: 60, created: 2023 },
        { name: "Yoga", description: "Yoga mats and accessories", items: 25, created: 2021 },
        { name: "Fishing", description: "Rods, reels, and bait", items: 18, created: 2020 }
    ];

    const access = [
        { name: "Golfing", description: "Best golf sticks", publicity: "public", owner: "Alice" },
        { name: "Tennis", description: "High-quality tennis rackets", publicity: "private", owner: "Bob" },
        { name: "Basketball", description: "Professional basketballs", publicity: "public", owner: "Charlie" },
        { name: "Swimming", description: "Premium swimwear and goggles", publicity: "private", owner: "Diana" },
        { name: "Cycling", description: "Mountain and road bikes", publicity: "public", owner: "Ethan" },
        { name: "Running", description: "Comfortable running shoes", publicity: "private", owner: "Fiona" },
        { name: "Yoga", description: "Yoga mats and accessories", publicity: "public", owner: "George" },
        { name: "Fishing", description: "Rods, reels, and bait", publicity: "private", owner: "Hannah" }
    ];

    const filteredAccess = filter ? access.filter(item => item.publicity === filter) : access;
    const personalColumns = [
        { key: 'checkbox', label: '', render: () => <input type="checkbox" /> },
        { key: 'name', label: 'Name', sortable: true, render: (value) => <a className="text-decoration-none" href='/inventory'>{value}</a> },
        { key: 'description', label: 'Description', sortable: true, className: 'd-none d-sm-table-cell' },
        { key: 'items', label: 'Items', sortable: true },
        { key: 'created', label: 'Created', sortable: true, className: 'd-none d-sm-table-cell' }
    ];

    const accessColumns = [
    { 
        key: 'name', 
        label: 'Name', 
        sortable: true, 
        render: (value) => <a style={{ textDecoration: 'none' }} href='/inventory'>{value}</a> 
    },
    { 
        key: 'description', 
        label: 'Description', 
        sortable: true, 
        className: 'd-none d-sm-table-cell' 
    },
    { 
        key: 'publicity', 
        label: (
            <Dropdown>
                <Dropdown.Toggle 
                    as="div" 
                    style={{ cursor: 'pointer', userSelect: 'none', width: '100%', textAlign: 'center' }}
                >
                    Publicity
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handlePublicityClick('public')}>Show public</Dropdown.Item>
                    <Dropdown.Item onClick={() => handlePublicityClick('private')}>Show private</Dropdown.Item>
                    <Dropdown.Item onClick={() => handlePublicityClick(null)}>Show all</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        ),
        className: 'text-center'
    },
    { 
        key: 'owner', 
        label: 'Owner', 
        sortable: true, 
        className: 'd-none d-sm-table-cell text-decoration-none', 
        render: (value) => <a href='/personal'>{value}</a> 
    }
];

    return (
        <Container className="mt-5 p-5">
            <SharedNavbar />
                <div className="mb-5">
                    <p className="fs-1">Your Inventories</p>

                    {error && (<div className="alert alert-danger" role="alert">
                        {error}
                    </div>)}

                    <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                        <Button variant="danger" onClick={() => alert("Delete user")} title="Delete">
                            <FaTrash color='white' />
                        </Button>
                        <Button variant="success" onClick={handleCreateInventory} title="Create New Inventory">
                            <FaPlus color='white' />
                        </Button>
                    </div>
                    <DataTable data={data} columns={personalColumns} itemsPerPage={5} />
                </div>

                <div>
                    <p className="fs-1">You have access to</p>
                    <DataTable data={filteredAccess} columns={accessColumns} itemsPerPage={5} />
                </div>
        </Container>
    );
}

export default PersonalPage;
