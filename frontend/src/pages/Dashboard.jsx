import { useState, useEffect } from 'react';
import api from '../api';
import { Users, FileText, Code2, Calendar } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({ projects: 0, resources: 0, discussions: 0, hackathons: 0 });
    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [postsRes, resourcesRes, commentsRes, hackathonsRes] = await Promise.all([
                    api.get('posts/?post_type=project'),
                    api.get('resources/'),
                    api.get('comments/'),
                    api.get('hackathons/')
                ]);

                setStats({
                    projects: postsRes.data.length,
                    resources: resourcesRes.data.length,
                    discussions: commentsRes.data.length, // total comments proxy for activity
                    hackathons: hackathonsRes.data.length
                });

                setRecentPosts(postsRes.data.slice(0, 5)); // First 5 recent posts
            } catch (err) {
                console.error("Failed to load dashboard data");
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Welcome to the student collaboration hub.</p>

            <div className="grid-3" style={{ marginBottom: '3rem' }}>
                <div className="glass-card flex-between">
                    <div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Project Collabs</h3>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.projects}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.2)', borderRadius: '50%' }}>
                        <Users size={32} color="var(--primary-color)" />
                    </div>
                </div>

                <div className="glass-card flex-between">
                    <div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Resources Shared</h3>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.resources}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%' }}>
                        <FileText size={32} color="var(--success)" />
                    </div>
                </div>

                <div className="glass-card flex-between">
                    <div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Upcoming Hackathons</h3>
                        <h2 style={{ fontSize: '2rem', margin: 0 }}>{stats.hackathons}</h2>
                    </div>
                    <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '50%' }}>
                        <Calendar size={32} color="var(--danger)" />
                    </div>
                </div>
            </div>

            <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Code2 size={24} color="var(--primary-hover)" /> Recent Collaboration Requests
                </h2>
                {recentPosts.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No collaboration requests yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recentPosts.map((post) => (
                            <div key={post.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{post.title}</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    Posted by {post.user_name} • {new Date(post.created_at).toLocaleDateString()}
                                </p>
                                <p>{post.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
