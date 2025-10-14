import DataTable from '../../components/dataTable';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';

function ItemsTab({ itemsData }) {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'checkbox',
      label: '',
      render: () => <input type="checkbox" />,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          className='text-decoration-none'
          onClick={() => navigate('/items', { state: { item: row } })}
        >
          {value}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      className: 'd-none d-sm-table-cell'
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true
    }
  ];

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
      <DataTable data={itemsData} columns={columns} />
    </div>
  );
}

export default ItemsTab;
