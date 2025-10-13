import SharedNavbar from '../components/navbar';
import Table from 'react-bootstrap/Table';
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function PersonalPage() {
    const navigate = useNavigate();

    const [filter, setFilter] = useState(null);

    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [accessSortConfig, setAccessSortConfig] = useState({ key: 'name', direction: 'asc' });

    const handlePublicityClick = (value) => {
        setFilter(value);
    };

    const handleSort = (key, dataset = "personal") => {
        if (dataset === "personal") {
            setSortConfig(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }));
        } else {
            setAccessSortConfig(prev => ({
                key,
                direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
            }));
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

    const sortData = (data, config) => {
        if (!config.key) return data;
        return [...data].sort((a, b) => {
            if (a[config.key] < b[config.key]) return config.direction === 'asc' ? -1 : 1;
            if (a[config.key] > b[config.key]) return config.direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const sortedData = sortData(data, sortConfig);
    const sortedAccess = sortData(filteredAccess, accessSortConfig);

    const getSortArrow = (config, key) => {
        if (config.key !== key) return '';
        return config.direction === 'asc' ? '↓' : '↑';
    };

    return (
        <div className='vh-100 p-5 d-flex align-items-center justify-content-center'>
            <SharedNavbar />
            <div className='mt-5 h-100 w-75'>
                {/* --- Your Inventories --- */}
                <div>
                    <p className="fs-1">Your Inventories</p>
                    <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                        <Button variant="danger" onClick={() => alert("Delete user")} title="Delete">
                            <FaTrash color='white' />
                        </Button>
                        <Button variant="success" onClick={() => navigate('/inventory')} title="Create New Inventory">
                            <FaPlus color='white' />
                        </Button>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th><Form.Check type="checkbox" /></th>
                                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                    Name {getSortArrow(sortConfig, 'name')}
                                </th>
                                <th className='d-none d-sm-table-cell' onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}>
                                    Description {getSortArrow(sortConfig, 'description')}
                                </th>
                                <th onClick={() => handleSort('items')} style={{ cursor: 'pointer' }}>
                                    Items {getSortArrow(sortConfig, 'items')}
                                </th>
                                <th className='d-none d-sm-table-cell' onClick={() => handleSort('created')} style={{ cursor: 'pointer' }}>
                                    Created {getSortArrow(sortConfig, 'created')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedData.map((inventory, index) => (
                                <tr key={index}>
                                    <td><Form.Check type="checkbox" /></td>
                                    <td><a style={{ textDecoration: "none" }} href='/inventory'>{inventory.name}</a></td>
                                    <td className='d-none d-sm-table-cell'>{inventory.description}</td>
                                    <td>{inventory.items}</td>
                                    <td className='d-none d-sm-table-cell'>{inventory.created}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.First />
                            <Pagination.Prev />
                            <Pagination.Item active>{12}</Pagination.Item>
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination>
                    </div>
                </div>

                {/* --- Access Table --- */}
                <div>
                    <p className="fs-1">You have access to</p>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name', 'access')} style={{ cursor: 'pointer' }}>
                                    Name {getSortArrow(accessSortConfig, 'name')}
                                </th>
                                <th className='d-none d-sm-table-cell' onClick={() => handleSort('description', 'access')} style={{ cursor: 'pointer' }}>
                                    Description {getSortArrow(accessSortConfig, 'description')}
                                </th>
                                <th className="text-center align-middle d-inline-flex align-items-center justify-content-center w-100">
                                    <Dropdown>
                                        <Dropdown.Toggle size="sm">Filter</Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handlePublicityClick('public')}>Show public</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePublicityClick('private')}>Show private</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handlePublicityClick(null)}>Show all</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </th>
                                <th className='d-none d-sm-table-cell' onClick={() => handleSort('owner', 'access')} style={{ cursor: 'pointer' }}>
                                    Owner {getSortArrow(accessSortConfig, 'owner')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAccess.map((inventory, index) => (
                                <tr key={index}>
                                    <td><a style={{ textDecoration: "none" }} href='/inventory'>{inventory.name}</a></td>
                                    <td className='d-none d-sm-table-cell'>{inventory.description}</td>
                                    <td className='d-none d-sm-table-cell'>{inventory.publicity}</td>
                                    <td><a style={{ textDecoration: "none" }} href='/personal'>{inventory.owner}</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-center mt-3">
                        <Pagination>
                            <Pagination.First />
                            <Pagination.Prev />
                            <Pagination.Item active>{12}</Pagination.Item>
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PersonalPage;
