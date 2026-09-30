import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaBriefcase, FaUserFriends, FaFileInvoice, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaStar, FaDownload } from 'react-icons/fa';
import './Career.css';

const Career = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const jobs = [
        { 
            id: 1, 
            title: 'Senior Aesthetic Nurse Specialist', 
            clinic: 'Luxe Skin Clinic', 
            location: 'Makati City', 
            salary: 'Php 45k - 65k', 
            type: 'Full-time' 
        },
        { 
            id: 2, 
            title: 'Dermatology Nurse Practitioner', 
            clinic: 'St. Luke\'s Medical Center', 
            location: 'BGC, Taguig', 
            salary: 'Competitive', 
            type: 'Full-time' 
        },
        { 
            id: 3, 
            title: 'Laser Technician / RN', 
            clinic: 'DermaCare Institute', 
            location: 'Quezon City', 
            salary: 'Php 30k - 40k', 
            type: 'Part-time' 
        },
        { 
            id: 4, 
            title: 'Head of Clinical Training', 
            clinic: 'ADANP Partner Hospital', 
            location: 'Manila', 
            salary: 'Php 70k+', 
            type: 'Full-time' 
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
        <div className="career-layout">
            <Sidebar />
            <div className="career-main-area">
                <header className="career-topbar">
                    <h2 className="topbar-title">Career Hub</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="career-content-container">
                    <div className="career-hero-grid">
                        {/* Job Board Section */}
                        <section className="career-card">
                            <h3><FaBriefcase /> Premium Job Board</h3>
                            <div className="job-list">
                                {jobs.map(job => (
                                    <div key={job.id} className="job-item">
                                        <div className="job-details">
                                            <h4>{job.title}</h4>
                                            <div className="job-meta">
                                                <span><FaStar /> {job.clinic}</span>
                                                <span><FaMapMarkerAlt /> {job.location}</span>
                                                <span><FaMoneyBillWave /> {job.salary}</span>
                                                <span><FaClock /> {job.type}</span>
                                            </div>
                                        </div>
                                        <button className="btn-apply">View Details</button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {/* Mentorship Section */}
                            <section className="career-card mentorship-card">
                                <h3><FaUserFriends /> Mentorship Program</h3>
                                <p>Accelerate your career by pairing with a senior ADANP fellow. Get guidance on clinical techniques and clinic management.</p>
                                <div className="mentorship-stats">
                                    <div className="m-stat">
                                        <span className="val">42</span>
                                        <span className="lbl">Active Mentors</span>
                                    </div>
                                    <div className="m-stat">
                                        <span className="val">150+</span>
                                        <span className="lbl">Graduates</span>
                                    </div>
                                </div>
                                <button className="btn-mentorship" onClick={() => alert('Mentorship application form will open soon!')}>Join as Mentee</button>
                            </section>

                            {/* Resume Builder Section */}
                            <section className="career-card resume-card">
                                <h3><FaFileInvoice /> Aesthetic CV Builder</h3>
                                <p>Generate a professional resume optimized for top aesthetic clinics, including your ADANP certifications and verified clinical hours.</p>
                                <div className="resume-preview-box">
                                    <FaFileInvoice size={50} />
                                </div>
                                <button className="btn-resume"><FaDownload /> Export Professional CV</button>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Career;
