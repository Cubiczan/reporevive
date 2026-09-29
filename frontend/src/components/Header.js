import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-icon">♻️</span>
          Repo<span>Revive</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/analyze" className={location.pathname === '/analyze' ? 'active' : ''}>Analyze</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link>
          <Link to="/analyze" className="cta">Get Started →</Link>
        </nav>
      </div>
    </header>
  );
}
