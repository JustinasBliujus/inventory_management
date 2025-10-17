import { useState, useEffect } from 'react';
import SharedNavbar from '../components/navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaLock, FaAngleDoubleUp, FaUnlock, FaAngleDoubleDown, FaTrash } from 'react-icons/fa';
import { FaPersonCircleXmark } from "react-icons/fa6";
import DataTable from '../components/dataTable';
import { Container, Spinner, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { userService } from '../../api/userService';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers();
      const usersArray = res.data.users.map(u => ({
        ...u,
        selected: false,
        name: u.name || '-',
        surname: u.surname || '-',
        email: u.email || '-',
        status: u.status || '-',
        is_admin: u.is_admin === 1 ? 'true' : 'false',
        last_login: u.last_login || '-'
      }));
      setUsers(usersArray);
      setSelectAll(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login', {
          state: { error: { message: 'Your session has expired. Please log in again.' } }
        });
      } else {
        setError('Failed to fetch users');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setUsers(users.map(user => ({ ...user, selected: newSelectAll })));
  };

  const handleSelectRow = (email) => {
    setUsers(users.map(user => user.email === email ? { ...user, selected: !user.selected } : user));
  };

  const performAction = async (action) => {
    const selectedUsers = users.filter(u => u.selected);
    if (selectedUsers.length === 0 && action !== 'unverified') {
      setError("Please select at least one user.");
      return;
    }

    const emails = selectedUsers.map(u => u.email);

    try {
      setError(null);
      setSuccess(null);

      switch(action) {
        case "block":
          await userService.blockUsers({ emails });
          setSuccess("User(s) blocked successfully");
          break;
        case "unblock":
          await userService.unblockUsers({ emails });
          setSuccess("User(s) unblocked successfully");
          break;
        case "promote":
          await userService.promoteUsers({ emails });
          setSuccess("User(s) promoted to admin");
          break;
        case "demote":
          await userService.demoteUsers({ emails });
          setSuccess("User(s) demoted from admin");
          break;
        case "delete":
          await userService.deleteUsers({ emails });
          setSuccess("User(s) deleted");
          break;
        case "unverified":
          await userService.deleteUnverifiedUsers();
          setSuccess("All unverified users deleted");
          break;
        default:
          break;
      }

      fetchUsers();
    } catch (err) {
      setError("Action failed. Try again.");
      console.error(err);
    }
  };

  // Columns now inside component to avoid parsing issues
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
  { key: 'name', label: 'Name', sortable: true },
  { key: 'surname', label: 'Surname', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    header: (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Status can be Unverified, Verified, or Blocked</Tooltip>}
      >
        <span>Status</span>
      </OverlayTrigger>
    )
  },
  { key: 'is_admin', label: 'Admin', sortable: true },
  { key: 'last_login', label: 'Last Login', sortable: true },
  ];


  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container className="mt-5 p-5">
      <SharedNavbar />

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex gap-2 mb-3 mt-5 flex-wrap">
        <OverlayTrigger placement="top" overlay={<Tooltip>Block selected users</Tooltip>}>
          <Button variant="primary" onClick={() => performAction("block")}><FaLock color="white" /></Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Unblock selected users</Tooltip>}>
          <Button variant="success" onClick={() => performAction("unblock")}><FaUnlock color="white" /></Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Promote selected users to admin</Tooltip>}>
          <Button variant="info" onClick={() => performAction("promote")}><FaAngleDoubleUp color="white" /></Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Demote selected admins</Tooltip>}>
          <Button variant="warning" onClick={() => performAction("demote")}><FaAngleDoubleDown color="white" /></Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Delete selected users</Tooltip>}>
          <Button variant="danger" onClick={() => performAction("delete")}><FaTrash color="white" /></Button>
        </OverlayTrigger>

        <OverlayTrigger placement="top" overlay={<Tooltip>Delete all unverified users</Tooltip>}>
          <Button variant="secondary" onClick={() => performAction("unverified")}><FaPersonCircleXmark color="white" /></Button>
        </OverlayTrigger>
      </div>

      <DataTable
        data={users}
        columns={columns}
        itemsPerPage={10}
      />
    </Container>
  );
}

export default AdminPage;
