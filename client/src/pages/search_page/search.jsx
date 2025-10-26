import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/navbar';
import DataTable from '../components/dataTable';
import { Container, Alert } from 'react-bootstrap';
import { useAppContext } from '../../appContext';

function SearchResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useAppContext();

  const [inventories, setInventories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state && location.state.inventories) {
      setInventories(location.state.inventories);
    } else {
      setError('No search results found.');
    }
  }, [location.state]);

  const columns = [
    { key: 'id', label: '#', sortable: true },
    { 
      key: 'name', 
      label: 'Name', 
      sortable: true,
      render: (value, row) => (
        <span 
          style={{ cursor: 'pointer', color: '#0d6efd', textDecoration: 'underline' }}
          onClick={() => handleRowClick(row)}
        >
          {value}
        </span>
      )
    },
    { key: 'description', label: 'Description', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { 
      key: 'is_public', 
      label: 'Public', 
      sortable: true,
      render: (value) => (value == 1 ? 'Yes' : 'No')
    },
    { key: 'createdAt', label: 'Created At', sortable: true },
  ];


  const handleRowClick = (row) => {
    navigate('/inventory', { state: row.id });
  };

  return (
    <div>
      <SharedNavbar />
      <Container className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {!error && (
          <DataTable
            data={inventories}
            columns={columns}
            itemsPerPage={10}
            darkMode={darkMode}
          />
        )}
      </Container>
    </div>
  );
}

export default SearchResultsPage;
