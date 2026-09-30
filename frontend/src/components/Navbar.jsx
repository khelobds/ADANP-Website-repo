import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/adanp-logo.jpg';
import './Navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/board', label: 'Board' },
  { path: '/certification', label: 'Certification' },
  { path: '/membership', label: 'Membership' },
  { path: '/education', label: 'Education' },
  { path: '/policy', label: 'Policy & Advocacy' },
  { path: '/news', label: 'Conventions' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/work-with-us', label: 'Work With Us' },
  { path: '/contact', label: 'Contact' },
];

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <img src={logo} alt="ADANP Logo" className="navbar-logo-img" />
          <div className="navbar-logo-text">
            <strong>ADANP</strong>
            <span className="navbar-logo-subtitle">Association of Dermatology & Aesthetic Nurses of the Philippines</span>
          </div>
        </Link>

        <button
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar-toggle-bar"></span>
          <span className="navbar-toggle-bar"></span>
          <span className="navbar-toggle-bar"></span>
        </button>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="navbar-item">
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''} ${link.path === '/news' ? 'tooltip' : ''}`}
                onClick={closeMobileMenu}
              >
                {link.label}
                {link.path === '/news' && (
                  <span className="tooltip-text">{currentYear} Conventions</span>
                )}
              </Link>
            </li>
          ))}
          <li className="navbar-item nav-login-wrapper">
            <Link
              to="/login"
              className="navbar-link nav-login-btn"
              onClick={closeMobileMenu}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
