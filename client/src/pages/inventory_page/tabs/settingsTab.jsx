import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../appContext';
import '../../components/darkMode.css'
import { FaPlus } from 'react-icons/fa';
import Badge from 'react-bootstrap/Badge';

function SettingsTab({ inventory, setInventory, setSaved }) {
    const MAX_TAGS = 3;
    const MAX_LENGTH_TAGS = 15;
    const categories = [
        "Electronics",
        "Office",
        "Tools",
        "Clothing",
        "Home",
        "Food",
        "Health",
        "Sports",
        "Miscellaneous"
    ];
    const [name, setName] = useState(inventory.name || '');
    const [description, setDescription] = useState(inventory.description || '');
    const [category, setCategory] = useState(inventory.category || '');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState(
        inventory.tags
            ? inventory.tags.map(tag => (typeof tag === 'string' ? { id: tag, name: tag } : tag))
            : []
    );

    const { darkMode } = useAppContext();
    const { t } = useTranslation();

    useEffect(() => {
        setName(inventory.name || '');
        setDescription(inventory.description || '');
        setCategory(inventory.category || '');
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

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);
        setInventory(prev => ({ ...prev, name: newName }));
        setSaved(false);
    };

    const handleDescriptionChange = (e) => {
        const newDesc = e.target.value;
        setDescription(newDesc);
        setInventory(prev => ({ ...prev, description: newDesc }));
        setSaved(false);
    };

    const handleCategoryChange = (e) => {
        const newCat = e.target.value;
        setCategory(newCat);
        setInventory(prev => ({ ...prev, category: newCat }));
        setSaved(false);
    };

    const handleTagChange = (e) => {
        const value = e.target.value;
        if (/^[a-zA-Z]{0,15}$/.test(value)) setTagInput(value);
    };

    const addTag = () => {
        const trimmedTag = tagInput.trim();
        if (
            trimmedTag &&
            /^[a-zA-Z]{1,15}$/.test(trimmedTag) &&
            tags.length < MAX_TAGS &&
            !tags.some(t => t.name === trimmedTag)
        ) {
            const newTags = [...tags, { id: trimmedTag, name: trimmedTag }];
            setTags(newTags);
            setInventory(prev => ({ ...prev, tags: newTags }));
            setSaved(false);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        setInventory(prev => ({ ...prev, tags: newTags }));
        setSaved(false);
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
                        onChange={handleNameChange}
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
                        onChange={handleDescriptionChange}
                        placeholder="Enter description"
                        className={darkMode ? 'textarea-dark' : ''}
                    />
                </Form.Group>

                {/* Category */}
                <Form.Group className="mb-3" controlId="inventoryCategory">
                    <Form.Label>{t('category')}</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={handleCategoryChange}
                        className={darkMode ? 'textarea-dark' : ''}
                    >
                        {categories.map((category) => (
                        <option key={category} value={category}>
                        {category}
                        </option>
                    ))}
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
                                style={{ cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }}
                                bg={darkMode ? 'primary' : 'secondary'}
                                text='light'
                            >
                                {tag.name} &times;
                            </Badge>
                        ))}
                    </div>
                </Form.Group>
            </Form>
        </div>
    );
}

export default SettingsTab;
