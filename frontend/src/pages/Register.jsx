import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Code2 } from 'lucide-react';

export default function Register({ setUser }) {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', branch: ''
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('users/', formData);
            const res = await api.post('auth/login/', { email: formData.email, password: formData.password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            const userRes = await api.get('users/me/');
            setUser(userRes.data);
            navigate('/');
        } catch (err) {
            alert('Registration failed. Email might already exist.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-card" style={{ width: '450px', maxWidth: '100%', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <Code2 size={40} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                    <h2 className="text-gradient">Join BE Connect</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Create your engineering profile</p>
                </div>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input type="text" placeholder="John Doe" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" placeholder="john@college.edu" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Branch</label>
                        <select required value={formData.branch} onChange={(e) => setFormData({ ...formData, branch: e.target.value })}>
                            <option value="">Select Branch</option>
                            <option value="CSE">Computer Science</option>
                            <option value="IT">Information Technology</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Password</label>
                        <input type="password" required placeholder="••••••••" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>Create Account</button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ fontWeight: '600' }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
