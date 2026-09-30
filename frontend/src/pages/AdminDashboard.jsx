import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GalleryAdmin from './GalleryAdmin';
import logo from '../assets/adanp-logo.jpg';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'applicants') {
      fetchApplications();
    }
  }, [activeTab]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/adanp-back/get_all_applications.php");
      const data = await response.json();
      if (data.status === "success") {
        setApplications(data.data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpdateStatus = async (appId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this application?`)) return;

    try {
      const response = await fetch("http://localhost:8000/adanp-back/update_application.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_id: appId, action: action })
      });
      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert(`Application successfully ${action.toLowerCase()}ed.`);
        fetchApplications(); // refreshing table
      } else {
        alert(data.message || `Failed to ${action.toLowerCase()} application.`);
      }
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert('An expected error occurred.');
    }
  };

  const pendingApps = applications.filter(a => a.status === 'Pending').length;

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="admin-content-card">
          <h2>Overview</h2>
          <p>Welcome to the ADANP Administrator Dashboard.</p>
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Pending Applications</h3>
              <span className="stat-number">{pendingApps}</span>
            </div>
            <div className="stat-card">
              <h3>Total Applications</h3>
              <span className="stat-number">{applications.length}</span>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'applicants') {
      return (
        <div className="admin-content-card">
          <h2>Membership Applicants</h2>
          <div className="applicants-table-wrapper">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Age</th>
                  <th>License Number</th>
                  <th>Status</th>
                  <th>Proof of Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.full_name}</td>
                      <td>{app.age}</td>
                      <td>{app.license_number}</td>
                      <td>
                        <span className={`badge ${app.status.toLowerCase()}`}>{app.status}</span>
                      </td>
                      <td>
                        <button 
                          className="view-btn" 
                          onClick={() => setSelectedImage(`http://localhost:8000/${app.proof_of_payment_path}`)}
                        >
                          View Image
                        </button>
                      </td>
                      <td>
                        {app.status === 'Pending' ? (
                          <>
                            <button className="approve-btn" onClick={() => handleUpdateStatus(app.id, 'Approve')}>Approve</button>
                            <button className="reject-btn" onClick={() => handleUpdateStatus(app.id, 'Reject')}>Reject</button>
                          </>
                        ) : (
                          <span style={{color: '#666', fontSize: '0.9rem'}}>Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{textAlign: 'center'}}>No applications found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'gallery') {
      return (
        <div className="embedded-gallery">
          <GalleryAdmin />
        </div>
      );
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="ADANP Logo" />
          <div className="sidebar-logo-text">
            <strong>ADANP</strong>
            <span>Admin</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicants')}
          >
            Applicants
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery Admin
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-area">
        <header className="admin-topbar">
          <h1 className="topbar-title">
            {activeTab === 'dashboard' && 'Dashboard Overview'}
            {activeTab === 'applicants' && 'Applicant Management'}
            {activeTab === 'gallery' && 'Gallery Management'}
          </h1>
          <div className="topbar-user">
            <span>Admin User</span>
            <div className="user-avatar"></div>
          </div>
        </header>
        
        <div className="admin-content-container">
          {loading ? (
            <div className="admin-loader">
              <div className="admin-spinner"></div>
              <p>Loading data...</p>
            </div>
          ) : renderContent()}
        </div>
      </main>

      {/* Image Modal for Proof of Payment */}
      {selectedImage && (
        <div className="image-modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setSelectedImage(null)}>×</button>
            <img src={selectedImage} alt="Proof of Payment" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
