import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">✓</span>
        <span className="brand-name">Taskly</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={pathname === '/' ? 'active' : ''}>All Todos</Link>
      </div>
    </nav>
  );
}
