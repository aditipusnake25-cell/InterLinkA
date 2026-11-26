import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Bell, Compass, Feather, Heart, Home, LogOut, MessageCircle, Quote, Sparkles, UserRound, Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Avatar from './Avatar';

const links = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/stories', label: 'Stories', icon: Camera },
  { to: '/experiences', label: 'Daily experiences', icon: Feather },
  { to: '/motivation', label: 'Motivation', icon: Quote },
  { to: '/notifications', label: 'Notifications', icon: Bell }
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <NavLink className="brand" to="/app"><span className="brand-mark"><Sparkles size={18} /></span>interlinka</NavLink>
        <NavLink to="/profile"><Avatar user={user} size="small" /></NavLink>
      </header>
      <aside className="sidebar">
        <NavLink className="brand" to="/app"><span className="brand-mark"><Sparkles size={18} /></span>interlinka</NavLink>
        <div className="sidebar-label">YOUR SPACE</div>
        <nav className="side-nav">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
              {label === 'Notifications' && <span className="nav-dot" />}
            </NavLink>
          ))}
          <NavLink to="/profile" className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>
            <UserRound size={18} strokeWidth={1.8} /><span>My profile</span>
          </NavLink>
          <NavLink to="/app#composer" className="side-link" onClick={() => {
            window.setTimeout(() => document.getElementById('composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
          }}>
            <Heart size={18} strokeWidth={1.8} /><span>Create a post</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><Sparkles size={17} /><span>Small moments make a big community.</span></div>
          <button className="profile-switch" onClick={() => navigate('/profile')}>
            <Avatar user={user} size="small" />
            <span className="profile-switch-name"><strong>{user?.name}</strong><small>@{user?.username}</small></span>
            <UserRound size={16} />
          </button>
          <button className="side-link logout-link" onClick={signOut}><LogOut size={18} /><span>Log out</span></button>
        </div>
      </aside>
      <main className="app-main"><Outlet /></main>
      <footer className="mobile-nav">
        {links.slice(0, 4).map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} aria-label={label}><Icon size={19} /></NavLink>
        ))}
        <NavLink to="/notifications" aria-label="Notifications"><MessageCircle size={19} /></NavLink>
      </footer>
    </div>
  );
}
