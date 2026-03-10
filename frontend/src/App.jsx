import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from './api';

import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ProjectCollab from './pages/ProjectCollab';
import Discussion from './pages/Discussion';
import Resources from './pages/Resources';
import Hackathons from './pages/Hackathons';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem('access_token')) {
        try {
          const res = await api.get('users/me/');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />

        <Route element={<Layout user={user} setUser={setUser} />}>
          <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/projects" element={user ? <ProjectCollab user={user} /> : <Navigate to="/login" />} />
          <Route path="/discussion" element={user ? <Discussion user={user} /> : <Navigate to="/login" />} />
          <Route path="/resources" element={user ? <Resources user={user} /> : <Navigate to="/login" />} />
          <Route path="/hackathons" element={user ? <Hackathons user={user} /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
