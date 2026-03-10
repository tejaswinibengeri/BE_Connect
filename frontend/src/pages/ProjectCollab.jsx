import { useState, useEffect } from 'react';
import api from '../api';
import { PlusCircle, MessageCircle } from 'lucide-react';

export default function ProjectCollab({ user }) {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await api.get('posts/?post_type=project');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await api.post('posts/', { title, description, post_type: 'project' });
            setTitle('');
            setDescription('');
            setShowForm(false);
            fetchPosts();
        } catch (err) {
            alert("Failed to create post.");
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Project Collaboration</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find teammates for your next hackathon or academic project</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    <PlusCircle size={20} /> {showForm ? 'Cancel' : 'New Post'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Post Title (e.g. Looking for React Developer)" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <textarea placeholder="Describe the project and the skills you are looking for..." value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary">Post Request</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {posts.map(post => (
                    <div key={post.id} className="glass-card animate-fade-in">
                        <h3 style={{ fontSize: '1.4rem', color: 'var(--success)', marginBottom: '0.5rem' }}>{post.title}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                            Posted by <span style={{ color: 'white' }}>{post.user_name}</span> • {new Date(post.created_at).toLocaleDateString()}
                        </p>
                        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>{post.description}</p>
                        {post.user_skills && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--primary-hover)', marginBottom: '1rem' }}>
                                Poster Skills: {post.user_skills}
                            </p>
                        )}
                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                            <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageCircle size={16} /> Apply / Discuss
                            </button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No collaboration requests. Be the first to ask!</p>}
            </div>
        </div>
    );
}
