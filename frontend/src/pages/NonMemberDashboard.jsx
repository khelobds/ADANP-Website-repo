import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/adanp-logo.jpg';
import VideoBg from '../assets/VideoBg.mp4';
import Sidebar from '../components/Sidebar';
import './NonMemberDashboard.css';

const NonMemberDashboard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);
  const [appStatus, setAppStatus] = useState(null); // 'Pending', 'Approved', 'Rejected', 'Not Submitted'
  const [loading, setLoading] = useState(true);

  // Form states
  const [licenseNumber, setLicenseNumber] = useState('');
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [age, setAge] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load persisted user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchApplicationStatus(parsedUser.id);
    } else {
      // Not logged in properly, force them out
      navigate('/login');
    }
  }, [navigate]);

  const fetchApplicationStatus = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/adanp-back/get_application_status.php?user_id=${userId}`);
      const data = await response.json();
      if (data.status === "success" && data.application_status) {
        setAppStatus(data.application_status);

        // If approved, automatically upgrade their session and redirect to Member Dashboard
        if (data.application_status === 'Approved') {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            parsedUser.role = 'members';
            localStorage.setItem('user', JSON.stringify(parsedUser));

            // Short delay so they can see the status badge change before redirect
            setTimeout(() => {
              navigate('/member-dashboard');
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching application status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('non_member_id', user.id);
    formData.append('full_name', fullName);
    formData.append('age', age);
    formData.append('license_number', licenseNumber);
    formData.append('address', address);
    formData.append('proof_of_payment', proofOfPayment);

    try {
      const response = await fetch("http://localhost:8000/adanp-back/submit_application.php", {
        method: "POST",
        body: formData // DO NOT set Content-Type header. Browser sets multipart/form-data automatically.
      });

      const data = await response.json();
      if (response.ok && data.status === "success") {
        alert('Application submitted successfully!');
        setShowForm(false);
        setAppStatus('Pending'); // instantly optimistic update
      } else {
        alert(data.message || 'Failed to submit application.');
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusDescription = () => {
    if (appStatus === 'Pending') {
      return "Your application is currently pending validation by our admins. Please wait patiently.";
    } else if (appStatus === 'Approved') {
      return "Congratulations! Your application has been approved. You are now officially recognized as a member.";
    } else if (appStatus === 'Rejected') {
      return "Unfortunately, your application was rejected. Please review your details and you may submit again below.";
    }
    return "You currently do not have an active membership. Enjoy the benefits of becoming an official ADANP member by applying today.";
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
              <span>Dashboard</span>
            </div>
          </div>
          <button className="nm-logout-btn" onClick={handleLogout}>Logout</button>
        </header>

        {loading ? (
          <div className="nm-loading-container">
            <div className="nm-spinner"></div>
            <p>Loading application data...</p>
          </div>
        ) : (
          <main className="nm-main-content">
            <div className="nm-status-card">
              <h2>Welcome, {user?.email}!</h2>
              <div className="nm-status-badge">
                Status:
                <span className={`status-badge-dynamic ${appStatus ? appStatus.toLowerCase() : 'non-member'}`}>
                  {appStatus !== 'Not Submitted' && appStatus ? appStatus : 'Non-Member'}
                </span>
              </div>
              <p className="nm-status-desc">
                {renderStatusDescription()}
              </p>
              {(!showForm && (appStatus === 'Not Submitted' || appStatus === 'Rejected')) && (
                <button className="nm-apply-btn" onClick={() => setShowForm(true)}>
                  Be a member now!
                </button>
              )}
            </div>

            {showForm && (
              <div className="nm-form-card">
                <h3 className="nm-form-title">Membership Application</h3>
                <form onSubmit={handleSubmit} className="nm-application-form">
                  <div className="nm-input-group">
                    <input
                      type="text"
                      className="nm-input"
                      placeholder="Full Name (as per PRC)"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="nm-input-group row-group">
                    <input
                      type="number"
                      className="nm-input half-input"
                      placeholder="Age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      className="nm-input half-input"
                      placeholder="PRC License Number"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="nm-input-group">
                    <input
                      type="text"
                      className="nm-input"
                      placeholder="Complete Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  <div className="nm-input-group file-group">
                    <label className="nm-file-label">Upload Proof of Payment (Image)</label>
                    <input
                      type="file"
                      className="nm-file-input"
                      accept="image/*,.pdf"
                      onChange={(e) => setProofOfPayment(e.target.files[0])}
                      required
                    />
                  </div>

                  <div className="nm-form-actions">
                    <button type="button" className="nm-cancel-btn" onClick={() => setShowForm(false)} disabled={isSubmitting}>Cancel</button>
                    <button type="submit" className="nm-submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </main>
        )}
      </div>
    </>
  );
};

export default NonMemberDashboard;
