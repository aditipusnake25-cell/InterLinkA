import { Link, NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="brand"><span className="brand-mark"><Sparkles size={18} /></span>interlinka</Link>
      <nav className="landing-nav">
        <NavLink to="/">Home</NavLink><a href="/#explore">Explore</a><a href="/#about">About</a>
      </nav>
      <div className="header-actions">
        <Link className="button button-quiet" to="/login">Log in</Link>
        <Link className="button button-gradient button-small" to="/register">Get started <span>↗</span></Link>
      </div>
    </header>
  );
}
