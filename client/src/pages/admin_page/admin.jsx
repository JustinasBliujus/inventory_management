import { useState } from 'react';
import SharedNavbar from '../components/navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaLock, FaAngleDoubleUp, FaUnlock, FaAngleDoubleDown, FaTrash } from 'react-icons/fa';
import { FaPersonCircleXmark } from "react-icons/fa6";
import DataTable from '../components/dataTable';
import { Container } from 'react-bootstrap';

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

  const handleAction = (action) => {
    const selectedUsers = users.filter(u => u.selected);
    if (selectedUsers.length === 0) {
      alert("Please select at least one user.");
      return;
    }
    alert(`${action} for: ${selectedUsers.map(u => u.email).join(', ')}`);
  };

  const columns = [
    {
      key: 'select',
      label: (
        <Form.Check
          type="checkbox"
          checked={selectAll}
          onChange={handleSelectAll}
        />
      ),
      render: (_, row) => (
        <Form.Check
          type="checkbox"
          checked={row.selected}
          onChange={() => handleSelectRow(row.id)}
        />
      ),
    },
    { key: 'id', label: '#', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'firstName', label: 'First Name', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'lastName', label: 'Last Name', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastLogin', label: 'Last Login', sortable: true, className: 'd-none d-lg-table-cell' },
  ];

  return (
    <Container className="mt-5 p-5">
      <SharedNavbar />

        <div className="d-flex gap-2 mb-3 mt-5 flex-wrap">
          <Button variant="primary" title="Block" onClick={() => handleAction("Block user")}>
            <FaLock color="white" />
          </Button>
          <Button variant="success" title="Unblock" onClick={() => handleAction("Unlock user")}>
            <FaUnlock color="white" />
          </Button>
          <Button variant="info" title="Grant admin" onClick={() => handleAction("Promote user")}>
            <FaAngleDoubleUp color="white" />
          </Button>
          <Button variant="warning" title="Remove admin" onClick={() => handleAction("Demote user")}>
            <FaAngleDoubleDown color="white" />
          </Button>
          <Button variant="danger" title="Delete" onClick={() => handleAction("Delete user")}>
            <FaTrash color="white" />
          </Button>
          <Button variant="secondary" title="Delete unverified users" onClick={() => handleAction("Disable user")}>
            <FaPersonCircleXmark color="white" />
          </Button>
        </div>

        <DataTable
          data={users}
          columns={columns}
          itemsPerPage={5}
          onRowClick={(row) => console.log("Clicked:", row)}
        />
    </Container>
  );
}

export default AdminPage;
