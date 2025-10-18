import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SettingsTab({ inventory, setInventory }) {
    const [name, setName] = useState(inventory.name || '');
    const [description, setDescription] = useState(inventory.description || '');

    useEffect(() => {
        console.log(inventory)
        setName(inventory.name || '');
        setDescription(inventory.description || '');
    }, [inventory]);

    const handleSave = () => {
        setInventory(prev => ({
            ...prev,
            name,
            description
        }));
    };

    return (
        <div className="mt-3 p-2">
            <h4>General Settings</h4>
            <Form>
                <Form.Group className="mb-3" controlId="inventoryName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter inventory name"
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="inventoryDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                    />
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>Save Settings</Button>
            </Form>
        </div>
    );
}

export default SettingsTab;
