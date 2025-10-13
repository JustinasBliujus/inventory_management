import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function ItemsTab({ itemsData }) {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const getSortArrow = (config, key) => {
        if (config.key !== key) return '';
        return config.direction === 'asc' ? '↓' : '↑';
    };

    const sortedItems = [...itemsData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
        <div>
            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                <Button variant="danger" onClick={() => alert("Delete user")} title="Delete">
                    <FaTrash color='white' />
                </Button>
                <Button variant="success" onClick={() => navigate('/items')} title="Create New Inventory">
                    <FaPlus color='white' />
                </Button>
            </div>

            <h4>Items</h4>
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
                        <th onClick={() => handleSort('quantity')} style={{ cursor: 'pointer' }}>
                            Quantity {getSortArrow(sortConfig, 'quantity')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedItems.map((item) => (
                        <tr key={item.id}>
                            <td><Form.Check type="checkbox" /></td>
                            <td>
                                <span
                                    style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}
                                    onClick={() => navigate('/items', { state: { item } })}
                                >
                                    {item.name}
                                </span>
                            </td>
                            <td className='d-none d-sm-table-cell'>{item.description}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-3">
                <Pagination>
                    <Pagination.First />
                    <Pagination.Prev />
                    <Pagination.Item active>{1}</Pagination.Item>
                    <Pagination.Next />
                    <Pagination.Last />
                </Pagination>
            </div>
        </div>
    );
}

export default ItemsTab;
