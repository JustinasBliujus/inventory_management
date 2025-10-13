import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Pagination from 'react-bootstrap/Pagination';
import { FaTrash, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AccessTab({ itemsData }) {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [isPublic, setIsPublic] = useState(false);
    
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
    console.log(itemsData)
    const sortedEditors = [...(itemsData|| [])].sort((a, b) => {
        
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    return (
            <div>
                <div className="d-flex align-items-center gap-4 mb-3">
                    <h4 className="mb-0">Accessibility: {isPublic ? "Public" : "Private"}</h4>
                    <Form.Check
                        style={{ transform: "scale(1.5)" }}
                        type="switch"
                        id="public-switch"
                        checked={isPublic}
                        onChange={() => setIsPublic(!isPublic)}
                />
            </div>

            <div className="d-flex gap-2 mb-3 mt-2 flex-wrap">
                <Button variant="danger" onClick={() => alert("Remove editor")} title="Remove">
                    <FaTrash color='white' />
                </Button>
                <Button variant="success" onClick={() => navigate('/add-editor')} title="Add Editor">
                    <FaPlus color='white' />
                </Button>
            </div>

            <h4>Editors with Access</h4>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th><Form.Check type="checkbox" /></th>
                        <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                            Name {getSortArrow(sortConfig, 'name')}
                        </th>
                        <th onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                            Email {getSortArrow(sortConfig, 'email')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedEditors.map((editor, index) => (
                        <tr key={index}>
                            <td><Form.Check type="checkbox" /></td>
                            <td>
                                <a style={{ textDecoration: "none" }} href={`/personal/${editor.name}`}>
                                    {editor.name}
                                </a>
                            </td>
                            <td>{editor.email}</td>
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

export default AccessTab;
