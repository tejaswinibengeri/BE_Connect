import { useState, useEffect } from 'react';
import api from '../api';
import { MessageSquare, ThumbsUp, PlusCircle } from 'lucide-react';

export default function Discussion({ user }) {
    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState({});
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await api.get('posts/?post_type=discussion');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (postId) => {
        if (!commentText[postId]) return;
        try {
            await api.post('comments/', { post: postId, comment: commentText[postId] });
            setCommentText({ ...commentText, [postId]: '' });
            fetchPosts();
        } catch (err) {
            alert("Failed to add comment");
        }
    };

    const handleCreateQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('posts/', { title, description, post_type: 'discussion' });
            setTitle('');
            setDescription('');
            setShowForm(false);
            fetchPosts();
        } catch (err) {
            alert("Failed to create question.");
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Discussion Forum</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Ask technical questions and help your peers.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    <PlusCircle size={20} /> {showForm ? 'Cancel' : 'Ask Question'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Question Title (e.g. How does dependency injection work?)" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <textarea placeholder="Provide more details or context for your question..." value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary">Post Question</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {posts.map(post => (
                    <div key={post.id} className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ textAlign: 'center', paddingRight: '1rem', borderRight: '1px solid var(--border-color)' }}>
                                <ThumbsUp size={24} color="var(--primary-hover)" style={{ cursor: 'pointer', marginBottom: '0.5rem' }} />
                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{Math.floor(Math.random() * 10)}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    Asked by {post.user_name} on {new Date(post.created_at).toLocaleDateString()}
                                </p>
                                <div style={{ lineHeight: '1.6', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
                                    {post.description}
                                </div>
                            </div>
                        </div>

                        <div style={{ marginLeft: '4rem', marginTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageSquare size={18} /> Answers ({post.comments?.length || 0})
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                                {post.comments && post.comments.map(c => (
                                    <div key={c.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary-color)' }}>
                                        <p style={{ marginBottom: '0.5rem' }}>{c.comment}</p>
                                        <small style={{ color: 'var(--text-muted)' }}>— {c.user_name} at {new Date(c.created_at).toLocaleDateString()}</small>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    placeholder="Write an answer..."
                                    value={commentText[post.id] || ''}
                                    onChange={(e) => setCommentText({ ...commentText, [post.id]: e.target.value })}
                                />
                                <button className="btn-primary" onClick={() => handleAddComment(post.id)}>Post</button>
                            </div>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No questions yet. Be the first to ask one!</p>}
            </div>
        </div>
    );
}
