import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import logo from '../assets/adanp-logo.jpg';
import { FaIdCard, FaUserNurse, FaLock, FaDownload, FaPrint, FaSave, FaShieldAlt } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Initial state for editable fields
    const [profileData, setProfileData] = useState({
        full_name: '',
        member_id: 'ADANP-2024-0042',
        prc_no: '',
        prc_expiry: '',
        professional_bio: '',
        current_workplace: '',
        privacy_visibility: true,
        privacy_show_email: false,
        privacy_show_workplace: true
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setProfileData(prev => ({
                ...prev,
                full_name: parsedUser.full_name || '',
                current_workplace: parsedUser.current_workplace || '',
                professional_bio: parsedUser.professional_bio || ''
            }));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Profile updated successfully!');
            // Update local storage if needed
            const updatedUser = { ...user, ...profileData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }, 1000);
    };

    if (!user) return null;

    return (
        <div className="profile-layout">
            <Sidebar />
            <div className="profile-main-area">
                <header className="profile-topbar">
                    <h2 className="topbar-title">My Profile & Credentials</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="profile-content-container">
                    {/* Digital ID Section */}
                    <section className="profile-card">
                        <h3><FaIdCard /> Digital Membership Card</h3>
                        <div className="id-card-preview">
                            <div className="membership-card">
                                <div className="card-header">
                                    <div className="card-logo">
                                        <img src={logo} alt="ADANP" />
                                        <div className="card-logo-text">
                                            <strong>ADANP</strong>
                                            <span>Official Member</span>
                                        </div>
                                    </div>
                                    <div className="card-chip"></div>
                                </div>
                                <div className="card-body">
                                    <div className="card-photo">
                                        {/* Placeholder for member photo */}
                                        <div style={{ background: '#f0f0f0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FaUserNurse size={50} color="#ccc" />
                                        </div>
                                    </div>
                                    <div className="card-info">
                                        <span className="name">{profileData.full_name || 'Member Name'}</span>
                                        <span className="member-id">{profileData.member_id}</span>
                                        <span className="valid-thru">VALID THRU: 12/2025</span>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span className="official-badge">Certified Aesthetic Nurse</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button className="action-btn btn-secondary"><FaPrint /> Print Card</button>
                                <button className="action-btn btn-primary"><FaDownload /> Download PDF</button>
                            </div>
                        </div>
                    </section>

                    {/* PRC License Section */}
                    <section className="profile-card">
                        <h3><FaShieldAlt /> PRC License Tracking</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label>PRC License Number</label>
                                <input 
                                    type="text" 
                                    name="prc_no" 
                                    className="form-control" 
                                    placeholder="0000000"
                                    value={profileData.prc_no}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Expiration Date</label>
                                <input 
                                    type="date" 
                                    name="prc_expiry" 
                                    className="form-control"
                                    value={profileData.prc_expiry}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Current Workplace</label>
                            <input 
                                type="text" 
                                name="current_workplace" 
                                className="form-control" 
                                placeholder="Hospital or Clinic Name"
                                value={profileData.current_workplace}
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>

                    {/* Bio Section */}
                    <section className="profile-card">
                        <h3><FaUserNurse /> Professional Bio</h3>
                        <div className="form-group">
                            <label>Professional Background</label>
                            <textarea 
                                name="professional_bio" 
                                className="form-control" 
                                placeholder="Describe your experience in dermatology and aesthetic nursing..."
                                value={profileData.professional_bio}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </section>

                    {/* Privacy Settings Section */}
                    <section className="profile-card">
                        <h3><FaLock /> Privacy Settings</h3>
                        <div className="settings-list">
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Profile Visibility</h4>
                                    <p>Make your profile searchable by other members</p>
                                </div>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        name="privacy_visibility" 
                                        checked={profileData.privacy_visibility}
                                        onChange={handleInputChange}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Show Professional Bio</h4>
                                    <p>Display your bio in the member directory</p>
                                </div>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        name="privacy_show_workplace" 
                                        checked={profileData.privacy_show_workplace}
                                        onChange={handleInputChange}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                            <div className="setting-item">
                                <div className="setting-info">
                                    <h4>Display Email</h4>
                                    <p>Allow members to see your contact email</p>
                                </div>
                                <label className="switch">
                                    <input 
                                        type="checkbox" 
                                        name="privacy_show_email" 
                                        checked={profileData.privacy_show_email}
                                        onChange={handleInputChange}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </section>

                    <div className="save-btn-container">
                        <button 
                            className="action-btn btn-primary btn-save" 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <FaSave /> {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
