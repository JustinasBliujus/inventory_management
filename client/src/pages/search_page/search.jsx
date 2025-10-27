import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SharedNavbar from '../components/navbar';
import DataTable from '../components/dataTable';
import { Container, Alert } from 'react-bootstrap';
import { useAppContext } from '../../appContext';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function SearchResultsPage() {
  const MAX_TEXT_LENGTH = 20;
  const { t } = useTranslation();
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

  const query = location.state?.query?.toLowerCase() || "";

  const highlightMatch = (text) => {
    if (!text) return text;
    if (!query) {
      return text.length > MAX_TEXT_LENGTH ? text.substring(0, 15) + '...' : text;
    }

    const lowerText = text.toLowerCase();
    const startIndex = lowerText.indexOf(query);

    if (startIndex === -1) {
      if (text.length > MAX_TEXT_LENGTH) return text.substring(0, 15) + '...';
      return text;
    }

    const endIndex = startIndex + query.length;

    let displayStart = Math.max(0, startIndex - 5); 
    let displayEnd = Math.min(text.length, endIndex + 5); 

    if (displayEnd - displayStart > MAX_TEXT_LENGTH) {
      displayEnd = displayStart + MAX_TEXT_LENGTH;
    }

    const prefix = displayStart > 0 ? '...' : '';
    const suffix = displayEnd < text.length ? '...' : '';

    return (
      <>
        {prefix}
        {text.substring(displayStart, startIndex)}
        <mark style={{ backgroundColor: 'yellow' }}>
          {text.substring(startIndex, endIndex)}
        </mark>
        {text.substring(endIndex, displayEnd)}
        {suffix}
      </>
    );
  };

const columns = [
  { 
    key: 'inventory_name', 
    label: 'Inventory Name', 
    sortable: true,
    render: (value, row) => (
      <Link 
        className='text-decoration-none'
        to='/inventory'
        relative='route'
        state={{ inventoryId: row.inventory_id }}
      >
        {highlightMatch(value)}
      </Link>
    )
    },
    { 
      key: 'inventory_description', 
      label: 'Description', 
      sortable: true,
      render: (value) => highlightMatch(value)
    },
    { 
      key: 'user_name', 
      label: `Creator's name`, 
      sortable: true,
      render: (value) => highlightMatch(value)
    },
    { 
      key: 'user_surname', 
      label: `Creator's last name`,
      sortable: true,
      render: (value) => highlightMatch(value)
    },
    { 
      key: 'user_email', 
      label: `Creator's email`, 
      sortable: true,
      render: (value, row) => (
      <Link 
        className='text-decoration-none'
        to='/personal'
        relative='route'
        state={{ userId: row.user_id, name: row.user_name}}
      >
        {highlightMatch(value)}
      </Link>
    )
    },
  ];

  return (
    <div>
      <SharedNavbar />
      <Container className="mt-5">
        {error && <Alert variant="danger">{error}</Alert>}
        {!error && (
          <>
            {location.state?.query && (
              <h4>
                {t('searchResultsFor', { name: `"${location.state.query}"` })}
              </h4>
            )}

            <DataTable
              data={inventories}
              columns={columns}
              itemsPerPage={10}
              darkMode={darkMode}
            />
          </>
        )}
      </Container>
    </div>
  );
}

export default SearchResultsPage;
