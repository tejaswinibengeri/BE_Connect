import { useState, useEffect } from 'react';
import api from '../api';
import { Calendar as CalendarIcon, ExternalLink, PlusCircle } from 'lucide-react';

export default function Hackathons({ user }) {
    const [hackathons, setHackathons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', description: '', date: '', link: '' });

    const fetchHackathons = async () => {
        try {
            const res = await api.get('hackathons/');
            setHackathons(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchHackathons();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('hackathons/', formData);
            setFormData({ title: '', description: '', date: '', link: '' });
            setShowForm(false);
            fetchHackathons();
        } catch (err) {
            alert("Failed to submit hackathon.");
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Upcoming Hackathons</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find and participate in tech events and hackathons.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    <PlusCircle size={20} /> {showForm ? 'Cancel' : 'Post Event'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Hackathon Title" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                        <textarea placeholder="Event Description" required rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        <div className="grid-2">
                            <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                            <input type="url" placeholder="Registration Link" required value={formData.link} onChange={(e) => setFormData({ ...formData, link: e.target.value })} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="submit" className="btn-primary">Post Hackathon</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {hackathons.map(hackathon => (
                    <div key={hackathon.id} className="glass-card flex-between animate-fade-in" style={{ padding: '2rem' }}>
                        <div style={{ flex: 1, paddingRight: '2rem' }}>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <CalendarIcon size={20} color="var(--primary-color)" /> {hackathon.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                Date: {new Date(hackathon.date).toLocaleDateString()}
                            </p>
                            <p style={{ lineHeight: '1.6' }}>{hackathon.description}</p>
                        </div>
                        <div style={{ minWidth: '150px', textAlign: 'right', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                            <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', justifyContent: 'center', width: '100%' }}>
                                <ExternalLink size={18} /> Register
                            </a>
                        </div>
                    </div>
                ))}
                {hackathons.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No upcoming hackathons listed at the moment.</p>}
            </div>
        </div>
    );
}
