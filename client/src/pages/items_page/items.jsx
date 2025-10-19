import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Spinner } from 'react-bootstrap';

function ItemsPage() {
    const location = useLocation();
    const { item } = location.state || {};
    const [imgLoaded, setImgLoaded] = useState(false);

    if (!item) return <div>No item data found!</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '20px auto' }}>
            <Card>
                {item.imageUrl && !imgLoaded && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                        <Spinner animation="border" />
                    </div>
                )}
                {item.imageUrl && (
                    <Card.Img
                        variant="top"
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ maxHeight: '400px', objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
                        onLoad={() => setImgLoaded(true)}
                    />
                )}
                <Card.Body>
                    <Card.Title style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        {item.name}
                    </Card.Title>
                    <Card.Text><strong>Brand:</strong> {item.brand || 'N/A'}</Card.Text>
                    <Card.Text><strong>Category:</strong> {item.category || 'N/A'}</Card.Text>
                    <Card.Text><strong>Description:</strong> {item.description || 'N/A'}</Card.Text>
                    <Card.Text><strong>Quantity:</strong> {item.quantity}</Card.Text>
                    <Card.Text><strong>Price:</strong> ${item.price}</Card.Text>
                    <Card.Text><strong>Rating:</strong> {item.rating} / 5</Card.Text>
                    <Card.Text><strong>Creator:</strong> {item.creator}</Card.Text>
                </Card.Body>
            </Card>
        </div>
    );
}

export default ItemsPage;
