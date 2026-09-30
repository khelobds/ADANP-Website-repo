import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaGavel, FaFileDownload, FaInfoCircle, FaBell, FaExclamationTriangle, FaBalanceScale } from 'react-icons/fa';
import './Legal.css';

const Legal = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const consentForms = [
        { id: 1, name: 'Chemical Peel Informed Consent', format: 'PDF' },
        { id: 2, name: 'Botulinum Toxin A Treatment Form', format: 'DOCX' },
        { id: 3, name: 'Dermal Filler Procedure Agreement', format: 'PDF' },
        { id: 4, name: 'Laser Hair Removal Safety Consent', format: 'PDF' },
        { id: 5, name: 'Microneedling & PRP Treatment Consent', format: 'DOCX' }
    ];

    const regulatoryUpdates = [
        { 
            date: 'March 15, 2024', 
            title: 'New PRC Guidelines for Aesthetic Nursing Certification', 
            description: 'The Professional Regulation Commission (PRC) has released updated requirements for nurses practicing in specialized aesthetic clinics.' 
        },
        { 
            date: 'January 10, 2024', 
            title: 'DOH Administrative Order No. 2024-001', 
            description: 'Revised standards for ambulatory surgical centers and aesthetic procedure facilities across the Philippines.' 
        },
        { 
            date: 'November 22, 2023', 
            title: 'Updated Scope of Practice for Advanced Practice Nurses', 
            description: 'Clarifications on the independent clinical decision-making limits for dermatology nurses in private practice.' 
        }
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="legal-layout">
            <Sidebar />
            <div className="legal-main-area">
                <header className="legal-topbar">
                    <h2 className="topbar-title">Legal & Compliance</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="legal-content-container">
                    {/* Important Regulatory Alert */}
                    <div className="alert-regulatory">
                        <FaExclamationTriangle />
                        <div>
                            <strong>Regulatory Alert:</strong> PRC license renewal now requires at least 15 CPD units specifically from accredited aesthetic nursing providers.
                        </div>
                    </div>

                    {/* Scope of Practice Section */}
                    <section className="legal-section">
                        <h3><FaBalanceScale /> Scope of Practice</h3>
                        <div className="scope-grid">
                            <div className="scope-card">
                                <h4>Clinical Assessment</h4>
                                <p>Nurses are permitted to perform comprehensive skin assessments and document clinical histories prior to aesthetic procedures.</p>
                            </div>
                            <div className="scope-card">
                                <h4>Procedure Administration</h4>
                                <p>Execution of non-invasive procedures (Peels, Lasers) is permitted under established clinical protocols and physician supervision where required.</p>
                            </div>
                            <div className="scope-card">
                                <h4>Medication Management</h4>
                                <p>Administration of topical agents and injectables must strictly adhere to the Philippine Nursing Act and DOH safety standards.</p>
                            </div>
                        </div>
                    </section>

                    {/* Consent Form Templates Section */}
                    <section className="legal-section">
                        <h3><FaFileDownload /> Consent Form Templates</h3>
                        <div className="forms-grid">
                            {consentForms.map(form => (
                                <div key={form.id} className="form-download-item">
                                    <div className="file-info">
                                        <FaGavel color="#c99339" />
                                        <span className="file-name">{form.name}</span>
                                    </div>
                                    <FaFileDownload className="btn-download-icon" title={`Download as ${form.format}`} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Regulatory Updates Section */}
                    <section className="legal-section">
                        <h3><FaBell /> Regulatory Updates (DOH & PRC)</h3>
                        <div className="update-timeline">
                            {regulatoryUpdates.map((update, index) => (
                                <div key={index} className="update-item">
                                    <span className="update-date">{update.date}</span>
                                    <div className="update-content">
                                        <h4>{update.title}</h4>
                                        <p>{update.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Legal;
