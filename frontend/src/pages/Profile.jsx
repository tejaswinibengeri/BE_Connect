import { useState, useEffect } from 'react';
import api from '../api';
import { User as UserIcon, Settings, Github, Code, Save } from 'lucide-react';

export default function Profile({ user }) {
    const [profileData, setProfileData] = useState({
        name: '', branch: '', skills: '', github_link: '', bio: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                branch: user.branch || '',
                skills: user.skills || '',
                github_link: user.github_link || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`users/${user.id}/`, profileData);
            setIsEditing(false);
            alert('Profile updated successfully! Refresh to see changes globally.');
        } catch (err) {
            alert("Failed to update profile.");
        }
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>Student Profile</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your engineering identity.</p>
                </div>
                {!isEditing && (
                    <button className="btn-secondary" onClick={() => setIsEditing(true)}>
                        <Settings size={20} /> Edit Profile
                    </button>
                )}
            </div>

            <div className="glass-card animate-fade-in" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
                    <div style={{ background: 'var(--primary-color)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserIcon size={48} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profileData.name}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{profileData.branch} Student</p>
                    </div>
                </div>

                {isEditing ? (
                    <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="grid-2">
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                                <input type="text" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Branch</label>
                                <input type="text" value={profileData.branch} onChange={(e) => setProfileData({ ...profileData, branch: e.target.value })} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Skills (comma separated)</label>
                            <input type="text" value={profileData.skills} onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })} placeholder="React, Python, Django, MySQL" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>GitHub Profile Link</label>
                            <input type="url" value={profileData.github_link} onChange={(e) => setProfileData({ ...profileData, github_link: e.target.value })} placeholder="https://github.com/username" />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Short Bio</label>
                            <textarea rows="4" value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="A short bio about yourself..."></textarea>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button type="submit" className="btn-primary"><Save size={18} /> Save Changes</button>
                        </div>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="grid-2">
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Code size={18} /> Skills</h4>
                                <p style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                    {profileData.skills || 'No skills added yet.'}
                                </p>
                            </div>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Github size={18} /> GitHub</h4>
                                <p style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                    {profileData.github_link ? (
                                        <a href={profileData.github_link} target="_blank" rel="noopener noreferrer">{profileData.github_link}</a>
                                    ) : 'No GitHub link added.'}
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Bio</h4>
                            <p style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', lineHeight: '1.6' }}>
                                {profileData.bio || 'No bio provided.'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
