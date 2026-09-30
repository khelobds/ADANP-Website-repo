import { Link } from 'react-router-dom';
import './Footer.css';

const quickLinks = [
  { path: '/about', label: 'About Us' },
  { path: '/certification', label: 'Certification' },
  { path: '/membership', label: 'Membership' },
  { path: '/education', label: 'Education' },
];

const programsLinks = [
  { path: '/certification#can', label: 'Certified Aesthetic Nurse' },
  { path: '/certification#dnp', label: 'Dermatology Nurse Practitioner' },
  { path: '/certification#fadanp', label: 'Fellowship Program' },
  { path: '/education#msn', label: 'MSN Dermatology & Aesthetic' },
];

const contactEmails = [
  { email: 'admin@adanp.org', label: 'Admin' },
  { email: 'secretariat@adanp.org', label: 'Secretariat' },
  { email: 'membership@adanp.org', label: 'Membership' },
  { email: 'professionalconcerns@adanp.org', label: 'Professional Concerns' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About Section */}
          <div className="footer-section">
            <h4 className="footer-title">ADANP</h4>
            <p className="footer-description">
              Association of Dermatology & Aesthetic Nurses of the Philippines.
              Leading Filipino nurses in providing advanced quality care through
              competency-based dermatology and aesthetic nursing.
            </p>
            <div className="footer-contact">
              <p className="footer-phone">
                <strong>Phone:</strong> (02) 899 6471
              </p>
              <p className="footer-phone">
                <strong>Mobile:</strong> 0945 5933868
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <ul className="footer-links">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
              <li><Link to="/board">Board of Officers</Link></li>
              <li><Link to="/news">News & Events</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="footer-section">
            <h4 className="footer-title">Programs</h4>
            <ul className="footer-links">
              {programsLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <ul className="footer-links">
              {contactEmails.map((item) => (
                <li key={item.email}>
                  <a href={`mailto:${item.email}`}>{item.label}: {item.email}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} ADANP. All rights reserved.
          </p>
          <p className="footer-tagline">
            Excellence in Dermatology & Aesthetic Nursing
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
