import { useLocation } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { FaEdit } from "react-icons/fa";
import SharedNavbar from '../components/navbar';
import {Container} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../appContext';
import { useTranslation } from 'react-i18next';

function ItemsPage() {
    const { t } = useTranslation();
    const { darkMode, user } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const { item_id, inventory } = location.state || {};
    const requiredItem = Object.values(inventory.items).find(i => i.id == item_id);
    const isOwner = inventory.user_id === user.id || user.is_admin === true;
    const isEditor = isOwner || inventory.is_public === true || (inventory?.editors?.find(e => e.email === user.email) !== undefined);

    if (!item_id) return <div>{t('noElements')}</div>;

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
        <Container className='my-5'>
            <Card
                className={darkMode ? 'bg-dark text-light' : ''}
                style={darkMode ? { border: '1px solid #555' } : {}}
                >
                <div className="d-flex justify-content-between p-2" title={!isEditor ? t('noWriteAccess') : t('edit')}>
                
                    <p>{requiredItem.custom_id || requiredItem.id}</p>
                    <Button
                        disabled = {!isEditor}
                        variant='primary'
                        onClick={() => navigate('/addItem', { state: { inventory, mapping, item_id } })}
                    >
                        <FaEdit color="white" />
                    </Button>
                </div>

                <Card.Body>
                    <Card.Title style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>
                        {t('itemAddedBy', { email: requiredItem.creator_email })}
                    </Card.Title>
                    {mapping.map((it, index) => (
                    <Card.Text key={index}>
                        <strong>{`${it.label}: `}</strong> 
                            {it.value !== null && it.value !== undefined 
                            ? (typeof it.value === 'boolean' ? (it.value ? 'Yes' : 'No') 
                            : it.value) 
                            : 'N/A'}
                    </Card.Text>
                    ))}

                </Card.Body>
                </Card>

        </Container>
        </div>
    );
}

export default ItemsPage;
