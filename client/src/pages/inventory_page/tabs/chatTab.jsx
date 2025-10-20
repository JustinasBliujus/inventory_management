import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReactMarkdown from 'react-markdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { userService } from '../../../api/userService';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../appContext';
import '../../components/darkMode.css'

function ChatTab({ inventory, setInventory }) {
    const { t } = useTranslation();
    const { darkMode } = useAppContext();

    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState("");
    
    useEffect(() => {
        if (inventory?.chats) {
            const mappedPosts = inventory.chats.map(chat => ({
                id: chat.id,
                userName: chat.creator_email,
                content: chat.message,
                createdAt: chat.createdAt ? new Date(chat.createdAt) : new Date()
            }));
            setPosts(mappedPosts);
        }
    }, [inventory]);

    const handleSaveChat = async (message) => {
        if (!message || !inventory) return;

        const payload = {
            inventory_id: inventory.id,
            message
        };

        try {
            const result = await userService.saveChat(payload);
            console.log("Chat saved:", result.data);
            return result.data.chat; 
        } catch (err) {
            console.error("Failed to save chat:", err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const savedChat = await handleSaveChat(newPost.trim());
        if (!savedChat) return; 

        const nextPost = {
            id: savedChat.id,
            userName: 'You',
            content: savedChat.message,
            createdAt: new Date(savedChat.createdAt)
        };

        const updatedPosts = [...posts, nextPost];
        setPosts(updatedPosts);
        setNewPost("");

        if (setInventory) {
            const updatedInventory = {
                ...inventory,
                chats: [...(inventory.chats || []), savedChat]
            };
            setInventory(updatedInventory);
        }
    };

    const markdownHint = (
        <Tooltip id="markdown-tooltip">
            <div>
                <div><strong>{t('header')}</strong> <code>{t('headerExample')}</code></div>
                <div><strong>{t('bold')}</strong> <code>{t('boldExample')}*</code></div>
                <div><em>{t('italic')}</em> <code>{t('italicExample')}</code></div>
                <div>{t('listUnordered')}<code>{t('listUnorderedExample')}</code></div>
                <div>{t('listOrdered')}<code>{t('listOrderedExample')}</code></div>
                <div>{t('links')}<code>[text]({t('linkExample')})</code></div>
            </div>
        </Tooltip>
    );

    return (
        <div>
            <h4>{t('discussion')}</h4>

            <div 
                className={darkMode ? 'chat-container-dark mb-3' : 'mb-3'}
                style={{
                    maxHeight: '40vh',
                    overflowY: 'auto',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '8px',
                }}
            >
                {posts.map(post => (
                    <div key={post.id} className={darkMode ? '.chat-post-dark mb-3 p-2 border rounded' : 'mb-3 p-2 border rounded'}>
                        <div className="mb-1">
                            <a href={`/personal/${post.userId}`}><strong>{post.userName}</strong></a>{" "}
                            <small className={darkMode ? 'text-light' : 'text-muted'}>{post.createdAt.toLocaleString()}</small>
                        </div>
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                ))}
            </div>

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2" style={{ position: 'relative' }}>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder={t('writePost')}
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
                        className={darkMode ? 'textarea-dark' : ''}
                    />
                    <OverlayTrigger placement="auto" overlay={markdownHint} flip>
                        <Button
                            variant="secondary"
                            size="sm"
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                padding: '0 6px',
                                borderRadius: '50%'
                            }}
                        >
                            ?
                        </Button>
                    </OverlayTrigger>
                </Form.Group>
                <Button type="submit" variant="primary">{t('post')}</Button>
            </Form>
        </div>
    );
}

export default ChatTab;
