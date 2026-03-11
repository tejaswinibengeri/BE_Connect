import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, ListTodo } from 'lucide-react';

export default function Layout({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <ListTodo size={28} color="var(--primary-color)" />
                    <span>Task Manager</span>
                </div>
                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <CheckSquare size={20} /> My Tasks
                    </NavLink>
                </nav>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div className="nav-link" style={{ opacity: 0.9 }}>
                        {user?.name ? user.name : user?.email ? user.email : 'Signed in'}
                    </div>
                    <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: 'var(--danger)' }}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>
            <main className="main-content animate-fade-in">
                <Outlet />
            </main>
        </div>
    );
}
