import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ListTodo } from 'lucide-react';

export default function Register({ setUser }) {
    const [formData, setFormData] = useState({
        name: '', email: '', password: ''
    });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('auth/signup', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            navigate('/');
        } catch (err) {
            alert('Registration failed. Email might already exist.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="glass-card" style={{ width: '450px', maxWidth: '100%', padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <ListTodo size={40} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
                    <h2 className="text-gradient">Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Start managing your tasks</p>
                </div>
                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input type="text" placeholder="John Doe" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Email</label>
                        <input type="email" placeholder="you@example.com" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
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
