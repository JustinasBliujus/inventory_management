import SharedNavbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import './main.css';
import { TagCloud } from 'react-tagcloud'
import DataTable from '../components/dataTable';

const latestInventories = [
  { name: 'Inventory A', description: 'Electronics and gadgets', creator: 'Alice', image: null },
  { name: 'Inventory B', description: 'Books and novels', creator: 'Bob', image: null },
  { name: 'Inventory C', description: null, creator: 'Charlie', image: 'https://via.placeholder.com/50' },
  { name: 'Inventory D', description: 'Sports items', creator: 'David', image: null },
  { name: 'Inventory E', description: null, creator: 'Eve', image: 'https://via.placeholder.com/50' },
];

const popularInventories = [
  { name: 'Inventory X', items: 120, creator: 'Alice' },
  { name: 'Inventory Y', items: 98, creator: 'Bob' },
  { name: 'Inventory Z', items: 85, creator: 'Charlie' },
  { name: 'Inventory W', items: 70, creator: 'David' },
  { name: 'Inventory V', items: 50, creator: 'Eve' },
];

const tags = [
  { value: 'HTML', count: 28 },
  { value: 'Amazon Pay', count: 18 },
  { value: 'Code', count: 15 },
  { value: 'Cars', count: 3 },
  { value: 'Windows', count: 8 },
  { value: 'Apple', count: 10 },
  { value: 'Images', count: 20 },
  { value: 'JavaScript', count: 25 },
  { value: 'React', count: 30 },
  { value: 'Node.js', count: 22 },
  { value: 'CSS', count: 18 },
  { value: 'Python', count: 27 },
  { value: 'Machine Learning', count: 15 },
  { value: 'AI', count: 12 },
  { value: 'Data Science', count: 14 },
  { value: 'E-commerce', count: 10 },
  { value: 'Gaming', count: 8 },
  { value: 'Mobile Apps', count: 11 },
  { value: 'Cloud', count: 9 },
  { value: 'Databases', count: 13 },
  { value: 'Security', count: 7 },
  { value: 'Blockchain', count: 6 },
  { value: 'Travel', count: 5 },
  { value: 'Food', count: 4 },
  { value: 'Music', count: 12 },
  { value: 'Photography', count: 10 },
  { value: 'Startup', count: 8 },
  { value: 'Education', count: 9 },
  { value: 'Health', count: 6 },
  { value: 'Fitness', count: 5 }
];

const SimpleCloud = () => (
  <div className='d-flex justify-content-center text-center'>
    <TagCloud
      minSize={12}
      maxSize={35}
      tags={tags}
      onClick={tag => alert(`'${tag.value}' was selected!`)}
      className='d-none d-md-block w-75'
      style ={{ cursor: "pointer" }}
    />
  </div>
)

function MainPage() {

  const latestColumns = [
    { key: 'name', label: 'Name', sortable: true, render: (value) => <a href="/" className="text-decoration-none">{value}</a> },
    { key: 'description', label: 'Description', sortable: true, render: (value) => value || '-' },
    { key: 'creator', label: 'Creator', sortable: true, className: 'd-none d-sm-table-cell', render: (value) => <a href="/" className="text-decoration-none d-none d-sm-table-cell">{value}</a> }
  ];

  const popularColumns = [
    { key: 'name', label: 'Name', sortable: true, render: (value) => <a href="/" className="text-decoration-none">{value}</a> },
    { key: 'items', label: 'Items', sortable: true },
    { key: 'creator', label: 'Creator', sortable: true, className: 'd-none d-sm-table-cell', render: (value) => <a href="/" className="text-decoration-none d-none d-sm-table-cell">{value}</a> }
  ];

  return (
    <div className="vh-100">
      <SharedNavbar />
      <Container className="mt-5 p-5">
        <p className="fs-1 d-none d-md-block">Choose From Categories</p>
        <SimpleCloud></SimpleCloud>
        <p className="fs-1 d-none d-md-block">Latest Inventories</p>
        <DataTable data={latestInventories} columns={latestColumns} itemsPerPage={5} />
        <p className="fs-1 d-none d-md-block">Most Popular Inventories</p>
        <DataTable data={popularInventories} columns={popularColumns} itemsPerPage={5} />
      </Container>
    </div>
  );
}

export default MainPage;
