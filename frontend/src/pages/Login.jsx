import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Code2 } from 'lucide-react';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('auth/login/', { email, password });
            localStorage.setItem('access_token', res.data.access);
            localStorage.setItem('refresh_token', res.data.refresh);
            const userRes = await api.get('users/me/');
            setUser(userRes.data);
            navigate('/');
        } catch (err) {
            alert('Invalid login credentials');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '400px', maxWidth: '90%', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Code2 size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                    <h2 className="text-gradient">Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to BE Connect</p>
                </div>
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@college.edu" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>Login</button>
                </form>
                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ fontWeight: '600' }}>Register</Link>
                </p>
            </div>
        </div>
    );
}
