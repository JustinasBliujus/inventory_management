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
import { useAppContext } from '../../appContext';

function AdminPage() {
  const navigate = useNavigate();
  const { darkMode } = useAppContext();

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
        id: u.id,
        name: u.name || '-',
        surname: u.surname || '-',
        email: u.email || '-',
        status: u.status || '-',
        is_admin: u.is_admin == 1 ? 'True' : "False",
        last_login: u.last_login || '-'
      }));
      
      console.log("User IDs:", usersArray.map(u => u.id));
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

  const handleSelectRow = (id) => {
    console.log(id, " ID")
    const updatedUsers = users.map(user =>
      user.id === id ? { ...user, selected: !user.selected } : user
    );

    const allSelected = updatedUsers.every(u => u.selected);
    setUsers(updatedUsers);
    setSelectAll(allSelected);
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

  const columns = [
    {
      key: 'select',
      label: <Form.Check type="checkbox" checked={selectAll} onChange={handleSelectAll} />,
      render: (_, row) => <Form.Check type="checkbox" checked={row.selected} onChange={() => handleSelectRow(row.id)} />
    },
    { key: 'id', label: '#', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'name', label: 'First Name', sortable: true, className: 'd-none d-sm-table-cell' },
    { key: 'surname', label: 'Last Name', sortable: true, className: 'd-none d-sm-table-cell' },
    { 
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value, row) => (
        console.log('Render value:', value, 'Row:', row),
        <span
          className="text-decoration-none d-none d-sm-table-cell"
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => navigate('/personal', { state: { userId: row.id, name: row.name } })}
        >
          {value}
        </span>
      ) 
    },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'is_admin', label: 'Admin', sortable: true },
    { key: 'last_login', label: 'Last Login', sortable: true, className: 'd-none d-lg-table-cell' }
  ];

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
      <SharedNavbar />
    <Container className="mt-5 p-5">

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="d-flex gap-2 mb-3 mt-3 flex-wrap">
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

      <DataTable data={users} columns={columns} itemsPerPage={10} darkMode={darkMode}/>
    </Container>
    </div>
  );
}

export default AdminPage;
