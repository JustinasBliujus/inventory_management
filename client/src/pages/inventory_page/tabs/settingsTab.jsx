import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function SettingsTab({ itemsData }) {
    const [name, setName] = useState(itemsData.name || '');
    const [description, setDescription] = useState(itemsData.description || '');

    const handleSave = () => {
        alert(`Saved settings:\nName: ${name}\nDescription: ${description}`);
       
    };

    return (
        <div className="mt-3 p-2">
            <h4>General Settings</h4>
            <Form>
                <Form.Group className="mb-3" controlId="inventoryName">
                    <Form.Label>Inventory Name</Form.Label>
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
