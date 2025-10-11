import SharedNavbar from '../components/navbar';
import Table from 'react-bootstrap/Table';
import { useState } from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';
import { FaPlus, FaTrash } from 'react-icons/fa';

function PersonalPage () {
    const [filter, setFilter] = useState(null);

    const handlePublicityClick = (value) => {
        setFilter(value);
    };

    const data = [
        {name: "Golfing", description: "Best golf sticks", items: "32", created: "2022"},
        {name: "Tennis", description: "High-quality tennis rackets", items: "20", created: "2021"},
        {name: "Basketball", description: "Professional basketballs", items: "50", created: "2023"},
        {name: "Swimming", description: "Premium swimwear and goggles", items: "40", created: "2020"},
        {name: "Cycling", description: "Mountain and road bikes", items: "15", created: "2022"},
        {name: "Running", description: "Comfortable running shoes", items: "60", created: "2023"},
        {name: "Yoga", description: "Yoga mats and accessories", items: "25", created: "2021"},
        {name: "Fishing", description: "Rods, reels, and bait", items: "18", created: "2020"}
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

    return (
        <div className='vh-100 p-5 d-flex align-items-center justify-content-center'>
            <SharedNavbar />
            <div className='mt-5 h-100 w-75'>
                <div>
                    <p className="fs-1">Your Inventories</p>
                    <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                        <Button variant="danger" onClick={() => alert("Delete user")} title="Delete">
                            <FaTrash color='white'/>
                        </Button>
                        <Button variant="success" onClick={() => alert("Create Inventory")} title="Create New Inventory">
                            <FaPlus color='white'/>
                        </Button>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check
                                        type="checkbox"
                                    />
                                </th>
                                <th>Name</th>
                                <th className='d-none d-sm-table-cell'>Description</th>
                                <th>Items</th>
                                <th className='d-none d-sm-table-cell'>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((inventory, index) => (
                                <tr key={index}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                        />
                                    </td>
                                    <td><a style={{ textDecoration: "none" }} href='/personal'>{inventory.name}</a></td>
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

                <div>
                    <p className="fs-1">You have access to</p>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th className='d-none d-sm-table-cell'>Description</th>
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

                                <th className='d-none d-sm-table-cell'>Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAccess.map((inventory, index) => (
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
