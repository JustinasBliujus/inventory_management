import { useState } from 'react';
import SharedNavbar from '../components/navbar';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaLock, FaAngleDoubleUp, FaUnlock, FaAngleDoubleDown, FaTrash } from 'react-icons/fa';
import { FaPersonCircleXmark } from "react-icons/fa6";
import Pagination from 'react-bootstrap/Pagination';

function AdminPage() {
    const initialUsers = [
        { id: 1, firstName: 'Mark', lastName: 'Otto', email: 'mark.otto@mdo.com', status: 'blocked', lastLogin: 'yesterday', selected: false },
        { id: 2, firstName: 'Jacob', lastName: 'Thornton', email: 'jacob.thornton@fat.com', status: 'verified', lastLogin: 'now', selected: false },
    ];

    const [users, setUsers] = useState(initialUsers);
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setUsers(users.map(user => ({ ...user, selected: newSelectAll })));
    };

    const handleSelectRow = (id) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, selected: !user.selected } : user
        ));
    };

    return (
        <div className='vh-100 p-5'>
            <SharedNavbar />

            <div className="d-flex flex-column justify-content-center align-items-center" style={{ maxWidth: '1000px', margin: '0 auto', overflowX: 'auto' }}>

                <div className="d-flex gap-2 mb-3 mt-5 flex-wrap">
                <Button variant="primary" className="toolbar-btn" onClick={() => alert("Block user")} title="Block">
                    <FaLock color="white" />
                </Button>
                <Button variant="success" className="toolbar-btn" onClick={() => alert("Unlock user")} title="Unblock">
                    <FaUnlock color="white" />
                </Button>
                <Button variant="info" className="toolbar-btn" onClick={() => alert("Promote user")} title="Grant admin">
                    <FaAngleDoubleUp color='white'/>
                </Button>
                <Button variant="warning" className="toolbar-btn" onClick={() => alert("Demote user")} title="Remove admin">
                    <FaAngleDoubleDown color='white'/>
                </Button>
                <Button variant="danger" className="toolbar-btn" onClick={() => alert("Delete user")} title="Delete">
                    <FaTrash color='white'/>
                </Button>
                <Button variant="secondary" className="toolbar-btn" onClick={() => alert("Disable user")} title="Delete unverified users">
                    <FaPersonCircleXmark color='white'/>
                </Button>
            </div>

                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="d-none d-sm-table-cell">#</th>
                            <th className="d-none d-sm-table-cell">First Name</th>
                            <th className="d-none d-sm-table-cell">Last Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th className="d-none d-lg-table-cell">Last Login</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user.id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={user.selected}
                                        onChange={() => handleSelectRow(user.id)}
                                    />
                                </td>
                                <td className="d-none d-sm-table-cell">{index + 1}</td>
                                <td className="d-none d-sm-table-cell">{user.firstName}</td>
                                <td className="d-none d-sm-table-cell">{user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td className="d-none d-lg-table-cell">{user.lastLogin}</td>
                            </tr>
                        ))}
                    </tbody>
                    </Table>
                    <Pagination>
                        <Pagination.Prev />
                        <Pagination.Ellipsis />
                        <Pagination.Item>{1}</Pagination.Item>
                        <Pagination.Item active>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Ellipsis />
                        <Pagination.Next />
                    </Pagination>
            </div>
        </div>
    );
}

export default AdminPage;
