import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Login</Link>
        </li>
        <li>
          <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link>
        </li>
        <li>
          <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
        </li>
        <li>
          <Link to="/check" className={location.pathname === '/check' ? 'active' : ''}>Check</Link>
        </li>
        <li>
          <Link to="/report" className={location.pathname === '/report' ? 'active' : ''}>Report</Link>
        </li>
        <li>
          <Link to="/blockspam" className={location.pathname === '/blockspam' ? 'active' : ''}>Block Spam</Link>
        </li>
        <li>
          <Link to="/leaderboard" className={location.pathname === '/leaderboard' ? 'active' : ''}>Leaderboard</Link>
        </li>
        
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
