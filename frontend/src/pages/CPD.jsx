import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGraduationCap, FaAward, FaCloudUploadAlt, FaEye, FaDownload, FaTrash } from 'react-icons/fa';
import './CPD.css';

const CPD = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [progress, setProgress] = useState(65); // Mock progress percentage
    const [units, setUnits] = useState({ current: 26, required: 45 });
    
    const [certificates, setCertificates] = useState([
        { id: 1, title: 'Advanced Dermatology Workshop', date: 'Oct 12, 2023', issuer: 'ADANP Official', type: 'internal' },
        { id: 2, title: 'Aesthetic Nursing Symposium', date: 'Jan 25, 2024', issuer: 'ADANP Official', type: 'internal' },
        { id: 3, title: 'Basic Life Support (BLS)', date: 'Mar 05, 2024', issuer: 'External Provider', type: 'external' }
    ]);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            alert(`File "${file.name}" uploaded successfully! (Simulated)`);
            const newCert = {
                id: Date.now(),
                title: file.name.split('.')[0],
                date: new Date().toLocaleDateString(),
                issuer: 'Self Uploaded',
                type: 'external'
            };
            setCertificates([newCert, ...certificates]);
        }
    };

    if (!user) return null;

    return (
        <div className="cpd-layout">
            <Sidebar />
            <div className="cpd-main-area">
                <header className="cpd-topbar">
                    <h2 className="topbar-title">CPD & Certifications</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="cpd-content-container">
                    {/* CPD Tracker Section */}
                    <section className="cpd-section">
                        <h3><FaAward /> CPD Progress Tracker</h3>
                        <div className="tracker-container">
                            <div className="tracker-stats">
                                <div className="stat-group">
                                    <span className="label">Accumulated Units</span>
                                    <div className="value">
                                        {units.current} <span className="total">/ {units.required} Units</span>
                                    </div>
                                </div>
                                <div className="stat-group" style={{ textAlign: 'right' }}>
                                    <span className="label">Requirement Status</span>
                                    <span style={{ color: '#c99339', fontWeight: '700' }}>IN PROGRESS</span>
                                </div>
                            </div>
                            <div className="progress-bar-wrapper">
                                <div className="progress-fill" style={{ width: `${(units.current / units.required) * 100}%` }}>
                                    {Math.round((units.current / units.required) * 100)}%
                                </div>
                            </div>
                            <p className="tracker-legend">
                                You need <strong>{units.required - units.current}</strong> more units for your license renewal cycle.
                            </p>
                        </div>
                    </section>

                    {/* Certificate Vault Section */}
                    <section className="cpd-section">
                        <h3><FaGraduationCap /> Certificate Vault</h3>
                        <div className="vault-grid">
                            {certificates.map(cert => (
                                <div key={cert.id} className="cert-card">
                                    <div className="cert-preview">
                                        <FaGraduationCap size={60} color="#cbd5e0" />
                                        <div className="cert-overlay">
                                            <button className="view-cert-btn"><FaEye /> View</button>
                                        </div>
                                    </div>
                                    <div className="cert-info">
                                        <span className="issuer">{cert.issuer}</span>
                                        <h4>{cert.title}</h4>
                                        <span className="date">{cert.date}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Upload Portal Section */}
                    <section className="cpd-section">
                        <h3><FaCloudUploadAlt /> External Certificate Upload</h3>
                        <div className="upload-portal">
                            <label className="upload-area">
                                <input 
                                    type="file" 
                                    className="hidden-input" 
                                    onChange={handleFileUpload}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <div className="upload-icon">
                                    <FaCloudUploadAlt />
                                </div>
                                <div className="upload-text">
                                    <h4>Click or Drag to Upload</h4>
                                    <p>Support for PDF, PNG, JPG (Max 5MB)</p>
                                </div>
                            </label>
                            <div className="upload-actions">
                                <button className="btn-upload" onClick={() => document.querySelector('.hidden-input').click()}>
                                    <FaCloudUploadAlt /> Select File
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CPD;
