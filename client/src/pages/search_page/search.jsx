import SharedNavbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Card } from 'react-bootstrap';

// Sample search results data
const sampleResults = [
  { name: 'Inventory A', description: 'Electronics and gadgets', creator: 'Alice', items: 45 },
  { name: 'Inventory B', description: 'Books and novels', creator: 'Bob', items: 32 },
  { name: 'Inventory C', description: 'Sports equipment', creator: 'Charlie', items: 20 },
  { name: 'Inventory D', description: 'Office supplies', creator: 'David', items: 12 },
  { name: 'Inventory E', description: 'Kitchen items', creator: 'Eve', items: 25 },
];

function SearchPage() {
  const results = sampleResults;

  return (
    <div className="vh-100 bg-light">
      <SharedNavbar />

      <Container className="mt-5 p-3 p-md-5">
        <Card className="shadow-sm rounded-4 p-3 p-md-4">
          <Card.Header className="bg-success text-white fw-bold rounded-top-4 fs-5 fs-md-4">
            Search Results ({results.length})
          </Card.Header>

          {results.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="fs-6 fs-md-5">#</th>
                    <th className="fs-6 fs-md-5">Name</th>
                    <th className="fs-6 fs-md-5">Description</th>
                    <th className="fs-6 fs-md-5">Creator</th>
                    <th className="fs-6 fs-md-5">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((inv, i) => (
                    <tr key={i} className="py-2 py-md-3">
                      <td className="fs-6 fs-md-5">{i + 1}</td>
                      <td>
                        <a href="/" className="text-decoration-none text-success fw-bold fs-6 fs-md-5">
                          {inv.name}
                        </a>
                      </td>
                      <td className="fs-6 fs-md-5">{inv.description || '-'}</td>
                      <td>
                        <a href="/" className="text-decoration-none text-secondary fs-6 fs-md-5">
                          {inv.creator}
                        </a>
                      </td>
                      <td className="fs-6 fs-md-5">{inv.items}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-5 fs-6 fs-md-5 text-muted">No results found.</div>
          )}
        </Card>
      </Container>
    </div>
  );
}

export default SearchPage;
