import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home, User, Users, MessageSquare, BookOpen, Calendar, LogOut, Code2 } from 'lucide-react';

export default function Layout({ user, setUser }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <Code2 size={28} color="var(--primary-color)" />
                    <span>BE Connect</span>
                </div>
                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Home size={20} /> Dashboard
                    </NavLink>
                    <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Users size={20} /> Collaborations
                    </NavLink>
                    <NavLink to="/discussion" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <MessageSquare size={20} /> Discussions
                    </NavLink>
                    <NavLink to="/resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <BookOpen size={20} /> Resources
                    </NavLink>
                    <NavLink to="/hackathons" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <Calendar size={20} /> Hackathons
                    </NavLink>
                </nav>
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <User size={20} /> {user?.name || 'Profile'}
                    </NavLink>
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
