import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import './darkMode.css';

function DataTable({ data, columns, onRowClick, itemsPerPage = 10, darkMode }) {

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const truncateText = (text, maxLength = 20) => {
    if (!text) return text;
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key]?.toString().toLowerCase();
    const bVal = b[sortConfig.key]?.toString().toLowerCase();

    if (!aVal || !bVal) return 0; 

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0; 
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <Table striped bordered hover responsive className={darkMode ? 'table-dark' : 'table-light'}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                className={col.className || ''}
              >
                {col.header ? (
                  <>
                    {col.header}
                    {col.sortable && sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? '↓' : '↑') : ''}
                  </>
                ) : (
                  <>
                    {col.label} {col.sortable && sortConfig.key === col.key ? (sortConfig.direction === 'asc' ? '↓' : '↑') : ''}
                  </>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr key={row.id || index} onClick={() => onRowClick && onRowClick(row)}>
              {columns.map(col => (
                <td key={col.key} className={col.className || ''}>
                    {col.render ? col.render(row[col.key], row) : truncateText(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
}

export default DataTable;
