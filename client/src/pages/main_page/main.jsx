import { useState } from 'react';
import SharedNavbar from '../components/navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Container, Card } from 'react-bootstrap';
import './main.css';

// Sample data
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

const tagsWithoutShadows = [
  { popularity: '10', text: 'HTML' },
  { popularity: '2', text: 'Amazon Pay' },
  { popularity: '5', text: 'Code' },
  { popularity: '4', text: 'Cars' },
  { popularity: '3', text: 'Windows' },
  { popularity: '2', text: 'Apple' },
  { popularity: '8', text: 'Images' },
];

const bootstrapColors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

const getRandomColor = () =>
  bootstrapColors[Math.floor(Math.random() * bootstrapColors.length)];

const getFontSizeFromPopularity = (popularity) => {
  const minSize = 14;
  const maxSize = 32;
  const maxPopularity = 10;
  return minSize + ((maxSize - minSize) * (parseInt(popularity) / maxPopularity));
};

const TagButton = ({ text, color, fontSize }) => (
  <div className="d-inline-block m-2">
    <button
      type="button"
      className={`btn btn-${color} d-flex align-items-center shadow-sm`}
      style={{
        borderRadius: '50px',
        fontSize: `${fontSize}px`,
        padding: '0.4rem 1rem',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      {text}
    </button>
  </div>
);

function MainPage() {
  const [withoutShadowTags] = useState(
    tagsWithoutShadows.map((tag) => ({
      ...tag,
      color: getRandomColor(),
      fontSize: getFontSizeFromPopularity(tag.popularity),
    }))
  );

  return (
    <div className="vh-100 bg-light">
      <SharedNavbar />

      <Container className="mt-5 p-5">

        <Card className="mb-4 shadow-sm rounded-4 p-3">
          <Card.Header className="bg-info text-white fw-bold rounded-top-4">
            Tag Cloud
          </Card.Header>
          <div className="d-flex flex-wrap justify-content-center mt-3">
            {withoutShadowTags.map((tag, index) => (
              <TagButton key={index} {...tag} />
            ))}
          </div>
        </Card>

        <Card className="mb-4 shadow-sm rounded-4 p-3">
          <Card.Header className="bg-primary text-white fw-bold rounded-top-4">
            Latest Inventories
          </Card.Header>
          <Table striped bordered hover size="sm" className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Creator</th>
              </tr>
            </thead>
            <tbody>
              {latestInventories.map((inv, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <a href="/" className="text-decoration-none text-primary">{inv.name}</a>
                  </td>
                  <td>{inv.description || '-'}</td>
                  <td>
                    <a href="/" className="text-decoration-none text-secondary">{inv.creator}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        <Card className="mb-4 shadow-sm rounded-4 p-3">
          <Card.Header className="bg-success text-white fw-bold rounded-top-4">
            Top 5 Most Popular Inventories
          </Card.Header>
          <Table striped bordered hover size="sm" className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Items</th>
                <th>Creator</th>
              </tr>
            </thead>
            <tbody>
              {popularInventories.map((inv, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <a href="/" className="text-decoration-none text-success">{inv.name}</a>
                  </td>
                  <td>{inv.items}</td>
                  <td>
                    <a href="/" className="text-decoration-none text-secondary">{inv.creator}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </div>
  );
}

export default MainPage;
