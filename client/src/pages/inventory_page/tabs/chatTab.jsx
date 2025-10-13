import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ReactMarkdown from 'react-markdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

function ChatTab() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            userName: 'Alice',
            userId: 101,
            content: 'Hello everyone! **Welcome** to the Golfing inventory discussion.',
            createdAt: new Date('2025-10-13T12:00:00')
        },
        {
            id: 2,
            userName: 'Bob',
            userId: 102,
            content: 'I love the new *drivers* we got recently.',
            createdAt: new Date('2025-10-13T12:05:00')
        }
    ]);

    const [newPost, setNewPost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        const nextPost = {
            id: posts.length + 1,
            userName: 'You',
            userId: 999,
            content: newPost,
            createdAt: new Date()
        };

        setPosts([...posts, nextPost]);
        setNewPost("");
    };

    const markdownHint = (
        <Tooltip id="markdown-tooltip">
            <div style={{ fontSize: '0.85rem' }}>
                <div><strong>Headers:</strong> <code># H1</code>, <code>## H2</code>, etc.</div>
                <div><strong>Bold:</strong> <code>**bold**</code></div>
                <div><em>Italic:</em> <code>*italic*</code></div>
                <div>Unordered list: <code>- item</code></div>
                <div>Ordered list: <code>1. item</code></div>
                <div>Links: <code>[text](https://example.com)</code></div>
            </div>
        </Tooltip>
    );

    return (
        <div>
            <h4>Discussion</h4>

            <div 
            className="mb-3" 
            style={{
                maxHeight: '40vh',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '8px',
            }}>
                {posts.map(post => (
                    <div key={post.id} className="mb-3 p-2 border rounded">
                        <div className="mb-1">
                            <a href={`/personal/${post.userId}`}><strong>{post.userName}</strong></a>{" "}
                            <small className="text-muted">{post.createdAt.toLocaleString()}</small>
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
                        placeholder="Write a post using Markdown..."
                        value={newPost}
                        onChange={e => setNewPost(e.target.value)}
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
                <Button type="submit" variant="primary">Post</Button>
            </Form>
        </div>
    );
}

export default ChatTab;
