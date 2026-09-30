import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/adanp-logo.jpg';
import VideoBg from '../assets/VideoBg.mp4';
import './NonMemberDashboard.css'; // Reusing base styles for consistency
import Sidebar from '../components/Sidebar';


const MemberDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <video className="nm-video-bg" autoPlay loop muted playsInline>
        <source src={VideoBg} type="video/mp4" />
      </video>
      <Sidebar />
      <div className="nm-dashboard-container">
        <div className="nm-background-overlay"></div>

        <header className="nm-header">
          <div className="nm-logo-area">
            <img src={logo} alt="ADANP Logo" className="nm-logo-img" />
            <div className="nm-logo-text">
              <strong>ADANP</strong>
              <span>Official Member</span>
            </div>
          </div>
          <button className="nm-logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        <main className="nm-main-content">

          <h2 className="welcome-title">Welcome, Official Member!</h2>
          <div className="nm-status-card">

            <div className="nm-status-badge">
              Status: <span className="status-badge-dynamic approved">Approved Member</span>
            </div>
            <p className="nm-status-desc">
              You are now an official member of the Association of Dermatology & Aesthetic Nurses of the Philippines.
              You have full access to our member-only resources and community events.
            </p>
            <div className="member-options" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="nm-apply-btn" onClick={() => navigate('/gallery')}>View Gallery</button>
              <button className="nm-apply-btn" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }} onClick={() => navigate('/profile')}>Profile Settings</button>

            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default MemberDashboard;
