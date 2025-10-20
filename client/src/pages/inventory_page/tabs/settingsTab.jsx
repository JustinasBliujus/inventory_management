import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../appContext';
import '../../components/darkMode.css'
import { FaPlus } from 'react-icons/fa';
import Badge from 'react-bootstrap/Badge';
import { userService } from '../../../api/userService';

function SettingsTab({ inventory, setInventory }) {
    const MAX_TAGS = 3;
    const MAX_LENGTH_TAGS = 15;
    const [name, setName] = useState(inventory.name || '');
    const [description, setDescription] = useState(inventory.description || '');
    const [category, setCategory] = useState(inventory.category || '');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState(inventory.tags || []); 

    const { darkMode } = useAppContext();
    const { t } = useTranslation();

    useEffect(() => {
        setName(inventory.name || '');
        setDescription(inventory.description || '');
        setTags(inventory.tags || []);
         if (inventory.tags) {
            setTags(
            inventory.tags.map(tag => 
                typeof tag === "string" ? { id: tag, name: tag } : tag
            )
            );
        } else {
            setTags([]);
        }
    }, [inventory]);

    const handleSave = async () => {
        setInventory(prev => ({
            ...prev,
            name,
            description,
            category,
            tags
        }));
        const tagNames = tags.map(tag => (typeof tag === 'string' ? tag : tag.name));
        await handleSaveTags(tagNames);
    };

    const handleSaveTags = async (tags) => {
            if (!tags || !inventory) return;
            
            userService.saveTags({ tags: tags, inventoryId: inventory.id })
            .then(res => {
                if (res.data.success) {
                console.log("Tags saved:", res.data.tags);
                }
            })
            .catch(err => console.error("Failed to save tags:", err));
    };

    const handleTagChange = (e) => {
        const value = e.target.value;
        
        if (/^[a-zA-Z]{1,15}$/.test(value)) {
            setTagInput(value);
        }
    };

    const addTag = () => {
    const trimmedTag = tagInput.trim();
    console.log(trimmedTag)
    if (
        trimmedTag &&
        /^[a-zA-Z]{1,15}$/.test(trimmedTag) && 
        tags.length < MAX_TAGS &&
        !tags.some(t => t.name === trimmedTag)
    ) {
        setTags([...tags, { id: trimmedTag, name: trimmedTag }]);
        setTagInput('');
    }
    };


    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="mt-3 p-2">
            <h4>{t('generalSettings')}</h4>
            <Form>
                {/* Name */}
                <Form.Group className="mb-3" controlId="inventoryName">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter inventory name"
                        className={darkMode ? 'textarea-dark' : ''}
                    />
                </Form.Group>

                {/* Description */}
                <Form.Group className="mb-3" controlId="inventoryDescription">
                    <Form.Label>{t('description')}</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter description"
                        className={darkMode ? 'textarea-dark' : ''}
                    />
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3" controlId="inventoryCategory">
                    <Form.Label>{t('category')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={darkMode ? 'textarea-dark' : ''}
                    >
                        <option>Select category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Office">Office</option>
                        <option value="Tools">Tools</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                        <option value="Food">Food</option>
                        <option value="Health">Health</option>
                        <option value="Sports">Sports</option>
                        <option value="Miscellaneous">Miscellaneous</option>
                    </Form.Select>
                </Form.Group>

                {/* Tags */}
                <Form.Group className="mb-3" controlId="inventoryTags">
                    <Form.Label>{t('tagsInformation', { count: MAX_TAGS })}</Form.Label>
                    <div className="d-flex mb-2">
                        <Form.Control
                            type="text"
                            value={tagInput}
                            onChange={handleTagChange}
                            placeholder={t('tagsPlaceholder', { count: MAX_LENGTH_TAGS })}
                            className={darkMode ? 'textarea-dark' : ''}
                        />
                        <Button
                            variant="success"
                            onClick={addTag}
                            disabled={!tagInput || tags.length >= MAX_TAGS}
                            className="ms-2"
                        >
                            <FaPlus color='white' />
                        </Button>

                    </div>
                    <div>
                        {tags.map((tag, index) => (
                        <Badge
                            key={tag.id ?? index} 
                            onClick={() => removeTag(tag)}
                            title="Click to remove"
                            style={{cursor: 'pointer'}}
                            bg={darkMode ? 'primary' : 'secondary'}
                            text='light'
                        >
                            {tag.name} &times;
                        </Badge>
                        ))}
                    </div>
                </Form.Group>

                <Button variant="primary" onClick={handleSave}>{t('saveSettings')}</Button>
            </Form>
        </div>
    );
}

export default SettingsTab;
