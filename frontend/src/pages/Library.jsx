import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaBookOpen, FaFileAlt, FaBookmark, FaDownload, FaSearch, FaFeatherAlt } from 'react-icons/fa';
import './Library.css';

const Library = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const resources = [
        { 
            id: 1, 
            type: 'research', 
            title: 'Modern Approaches to Pediatric Atopic Dermatitis', 
            authors: 'Dr. Maria Santos, et al.', 
            date: '2023',
            source: 'Asian Journal of Dermatology'
        },
        { 
            id: 2, 
            type: 'guideline', 
            title: 'Standard Operating Procedure: Laser Skin Resurfacing', 
            authors: 'ADANP Clinical Committee', 
            date: 'Rev. 2024',
            source: 'ADANP Official SOP'
        },
        { 
            id: 3, 
            type: 'ebook', 
            title: 'Essentials of Aesthetic Nursing (3rd Edition)', 
            authors: 'V. Gomez & R. Reyes', 
            date: '2022',
            source: 'ADANP Textbook Series'
        },
        { 
            id: 4, 
            type: 'research', 
            title: 'Efficacy of Platelet-Rich Plasma in Alopecia Treatment', 
            authors: 'Dr. June Lee, Dr. Ken Chen', 
            date: '2024',
            source: 'Clinical Dermatology Review'
        },
        { 
            id: 5, 
            type: 'guideline', 
            title: 'Infection Control in Aesthetic Clinics', 
            authors: 'ADANP Regulatory Board', 
            date: '2024',
            source: 'Health & Safety Guidelines'
        },
        { 
            id: 6, 
            type: 'ebook', 
            title: 'Dermatology Pharmacology Handbook', 
            authors: 'PH Nursing Association', 
            date: '2023',
            source: 'Digital Resource'
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

    const filteredResources = activeTab === 'all' 
        ? resources 
        : resources.filter(res => res.type === activeTab);

    const getIcon = (type) => {
        switch(type) {
            case 'research': return <FaFeatherAlt />;
            case 'guideline': return <FaFileAlt />;
            case 'ebook': return <FaBookOpen />;
            default: return <FaBookmark />;
        }
    };

    if (!user) return null;

    return (
        <div className="library-layout">
            <Sidebar />
            <div className="library-main-area">
                <header className="library-topbar">
                    <h2 className="topbar-title">Clinical Library</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="library-content-container">
                    {/* Featured Resource */}
                    <div className="featured-resource">
                        <div className="featured-text">
                            <h2>2024 Clinical Update</h2>
                            <p>Download our latest comprehensive guide on Aesthetic Nursing Standards and Best Practices in the Philippines.</p>
                            <a href="#" className="btn-featured">Download Full Report</a>
                        </div>
                        <div className="featured-visual">
                            <FaBookOpen size={150} color="rgba(201, 147, 57, 0.3)" />
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="library-tabs">
                        <button 
                            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Resources
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'research' ? 'active' : ''}`}
                            onClick={() => setActiveTab('research')}
                        >
                            <FaFeatherAlt /> Research Papers
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'guideline' ? 'active' : ''}`}
                            onClick={() => setActiveTab('guideline')}
                        >
                            <FaFileAlt /> Clinical Guidelines
                        </button>
                        <button 
                            className={`tab-btn ${activeTab === 'ebook' ? 'active' : ''}`}
                            onClick={() => setActiveTab('ebook')}
                        >
                            <FaBookOpen /> E-Books
                        </button>
                    </div>

                    {/* Resource Grid */}
                    <div className="resource-grid">
                        {filteredResources.map(res => (
                            <div key={res.id} className="resource-card">
                                <div className="resource-icon-box">
                                    {getIcon(res.type)}
                                </div>
                                <div className="resource-details">
                                    <span className="resource-type">{res.type}</span>
                                    <h4 className="resource-title">{res.title}</h4>
                                    <div className="resource-meta">
                                        <span><strong>Author:</strong> {res.authors}</span>
                                        <span><strong>Source:</strong> {res.source} | {res.date}</span>
                                    </div>
                                    <div className="resource-actions">
                                        <button className="action-link btn-read">View Abstract</button>
                                        <button className="action-link btn-download"><FaDownload /> PDF</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;
