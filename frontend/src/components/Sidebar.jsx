import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FaHome, FaBars, FaIdCard, FaGraduationCap, FaBookOpen, FaPhotoVideo, FaTrophy } from 'react-icons/fa';
import { LuNotebook } from 'react-icons/lu';
import { GoLaw } from 'react-icons/go';
import { PiBriefcaseMetalFill } from 'react-icons/pi';
import { IoIosChatbubbles } from 'react-icons/io';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;


    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <h2>{isOpen ? "ADANP Dashboard" : "D"}</h2>
                <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
                    <FaBars />
                </button>
            </div>

            <ul className="sidebar-menu">
                <li className={`menu-item ${isActive('/member-dashboard') ? 'active' : ''}`} onClick={() => navigate('/member-dashboard')}>
                    <div className="menu-icon"><FaHome /></div>
                    <span className="menu-text">Home</span>
                </li>

                <li className={`menu-item ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigate('/profile')}>
                    <div className="menu-icon"><FaIdCard /></div>
                    <span className="menu-text">My Profile & Credentials</span>
                </li>

                <li className={`menu-item ${isActive('/cpd') ? 'active' : ''}`} onClick={() => navigate('/cpd')}>
                    <div className="menu-icon"><FaGraduationCap /></div>
                    <span className="menu-text">CPD & Certifications</span>
                </li>

                <li className={`menu-item ${isActive('/library') ? 'active' : ''}`} onClick={() => navigate('/library')}>
                    <div className="menu-icon"><FaBookOpen /></div>
                    <span className="menu-text">Clinical Library</span>
                </li>

                <li className={`menu-item ${isActive('/videos') ? 'active' : ''}`} onClick={() => navigate('/videos')}>
                    <div className="menu-icon"><FaPhotoVideo /></div>
                    <span className="menu-text">Procedure Videos</span>
                </li>

                <li className={`menu-item ${isActive('/logbook') ? 'active' : ''}`} onClick={() => navigate('/logbook')}>
                    <div className="menu-icon"><LuNotebook /></div>
                    <span className="menu-text">Case Logbook</span>
                </li>

                <li className={`menu-item ${isActive('/legal') ? 'active' : ''}`} onClick={() => navigate('/legal')}>
                    <div className="menu-icon"><GoLaw /></div>
                    <span className="menu-text">Legal & Compliance</span>
                </li>

                <li className={`menu-item ${isActive('/career') ? 'active' : ''}`} onClick={() => navigate('/career')}>
                    <div className="menu-icon"><PiBriefcaseMetalFill /></div>
                    <span className="menu-text">Career Hub</span>
                </li>

                <li className={`menu-item ${isActive('/forum') ? 'active' : ''}`} onClick={() => navigate('/forum')}>
                    <div className="menu-icon"><IoIosChatbubbles /></div>
                    <span className="menu-text">Community Forum</span>
                </li>

                <li className={`menu-item ${isActive('/achievements') ? 'active' : ''}`} onClick={() => navigate('/achievements')}>
                    <div className="menu-icon"><FaTrophy /></div>
                    <span className="menu-text">Achievements</span>
                </li>

            </ul>
        </div>
    );
}

export default Sidebar;