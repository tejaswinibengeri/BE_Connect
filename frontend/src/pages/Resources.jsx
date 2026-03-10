import { useState, useEffect } from 'react';
import api from '../api';
import { UploadCloud, Link as LinkIcon, Download } from 'lucide-react';

export default function Resources({ user }) {
    const [resources, setResources] = useState([]);
    const [title, setTitle] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [showForm, setShowForm] = useState(false);

    const fetchResources = async () => {
        try {
            const res = await api.get('resources/');
            setResources(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            await api.post('resources/', { title, file_url: fileUrl });
            setTitle('');
            setFileUrl('');
            setShowForm(false);
            fetchResources();
        } catch (err) {
            alert("Failed to upload resource.");
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Resource Sharing</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Notes, PDFs, source code, and video links.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    <UploadCloud size={20} /> {showForm ? 'Cancel' : 'Upload Resource'}
                </button>
            </div>

            {showForm && (
                <div className="glass-card animate-fade-in" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Resource Title (e.g. Data Structures Notes)" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        <input type="url" placeholder="Paste Link (Google Drive, GitHub repo, YouTube URL)" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} required />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn-primary">Share Link</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid-3" style={{ gap: '1.5rem', marginBottom: '2rem' }}>
                {resources.map(res => (
                    <div key={res.id} className="glass-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ flex: 1, marginBottom: '1rem' }}>
                            <div style={{ background: 'rgba(99, 102, 241, 0.1)', display: 'inline-flex', padding: '0.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
                                {res.file_url.includes('youtube.com') || res.file_url.includes('youtu.be') ? <LinkIcon size={24} color="var(--primary-color)" /> : <FileTextIcon />}
                            </div>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>{res.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>Shared by {res.uploaded_by_name}</p>
                        </div>
                        <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textAlign: 'center', width: '100%' }}>
                            <span style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}><Download size={16} /> Access Resource</span>
                        </a>
                    </div>
                ))}
                {resources.length === 0 && <p style={{ color: 'var(--text-muted)', marginTop: '2rem' }}>No resources shared yet.</p>}
            </div>
        </div>
    );
}

const FileTextIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
)
