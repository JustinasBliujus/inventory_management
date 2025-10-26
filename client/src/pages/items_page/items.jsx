import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Card, Spinner } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import SharedNavbar from '../components/navbar';
import {Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function ItemsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { item_id, inventory } = location.state || {};
    const [imgLoaded, setImgLoaded] = useState(false);

    const requiredItem = Object.values(inventory.items).find(i => i.id = item_id);
    console.log(JSON.stringify(requiredItem,null,2)+' ITEEEEM')

    if (!item_id) return <div>No item data found!</div>;
    const customTypes = ['line', 'multiline', 'number', 'url', 'bool'];
    const mapping = [];

    customTypes.forEach(type => {
        for (let i = 1; i <= 3; i++) {
        const nameKey = `custom_${type}${i}_name`;
        const stateKey = `custom_${type}${i}_state`;

        if (inventory[stateKey]) {
            mapping.push({
            stateKey: stateKey,
            label: inventory[nameKey] || `${type} ${i}`,
            value: requiredItem[`custom_${type}${i}`],
            });
        }
        }
    });

    return (
        <div>
            <SharedNavbar></SharedNavbar>
        <Container className='w-75 my-5'>
            <Card>
                <Button onClick={() => navigate('/addItem', { state: { inventory, mapping, item_id } })}>
                    <FaEdit color="white" ></FaEdit>
                </Button>
                {requiredItem.imageUrl && !imgLoaded && (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                        <Spinner animation="border" />
                    </div>
                )}
                {requiredItem.imageUrl && (
                    <Card.Img
                        variant="top"
                        src={requiredItem.imageUrl}
                        alt={requiredItem.name}
                        style={{ maxHeight: '400px', objectFit: 'cover', display: imgLoaded ? 'block' : 'none' }}
                        onLoad={() => setImgLoaded(true)}
                    />
                )}
                <Card.Body>
                    <Card.Title style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                        {`Item added by ${requiredItem.creator_email}`}
                    </Card.Title>
                    {
                        mapping.map((it,index) => (
                            <Card.Text key={index}><strong>{`${it.label}: `}</strong> {it.value || 'N/A'}</Card.Text>
                        ))
                    }
                </Card.Body>
            </Card>
        </Container>
        </div>
    );
}

export default ItemsPage;
