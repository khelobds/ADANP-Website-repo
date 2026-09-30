import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaTrophy, FaMedal, FaStar, FaUserTie, FaCalendarCheck, FaAward, FaHistory } from 'react-icons/fa';
import './Achievements.css';

const Achievements = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const badges = [
        { id: 1, name: 'Pioneer Member', desc: 'Joined in the first year', icon: <FaStar />, locked: false },
        { id: 2, name: 'Seminar regular', desc: 'Attended 10+ seminars', icon: <FaCalendarCheck />, locked: false },
        { id: 3, name: 'Safety First', desc: 'Completed Advanced Safety', icon: <FaMedal />, locked: false },
        { id: 4, name: 'Top Contributor', desc: 'Frequent forum sharer', icon: <FaAward />, locked: true },
        { id: 5, name: 'ADANP Fellow', desc: '5+ Years of Membership', icon: <FaTrophy />, locked: true }
    ];

    const milestones = [
        { date: '2024', title: '3rd Membership Anniversary', desc: 'Celebrating three years of professional growth with ADANP.' },
        { date: '2022', title: 'Official Certification', desc: 'Successfully completed the ADANP Aesthetic Nursing Core.' },
        { date: '2021', title: 'Joined ADANP', desc: 'Commenced professional journey into dermatology nursing.' }
    ];

    const leadershipRoles = [
        { year: '2023 - Present', position: 'Clinical Excellence Committee', role: 'Member' },
        { year: '2022 - 2023', position: 'Cebu Regional Chapter', role: 'Coordinator' }
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
        <div className="achievements-layout">
            <Sidebar />
            <div className="achievements-main-area">
                <header className="achievements-topbar">
                    <h2 className="topbar-title">Recognition & Achievements</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="achievements-content-container">
                    {/* Badges Section */}
                    <section className="achievements-section">
                        <h3><FaMedal /> Earned Badges</h3>
                        <div className="badges-grid">
                            {badges.map(badge => (
                                <div key={badge.id} className={`badge-item ${badge.locked ? 'locked' : ''}`}>
                                    <div className="badge-icon-box">{badge.icon}</div>
                                    <div className="badge-name">{badge.name}</div>
                                    <div className="badge-desc">{badge.desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Milestones Section */}
                    <section className="achievements-section">
                        <h3><FaHistory /> Professional Milestones</h3>
                        <div className="milestones-list">
                            {milestones.map((ms, index) => (
                                <div key={index} className="milestone-card">
                                    <div className="milestone-date">{ms.date}</div>
                                    <div className="milestone-info">
                                        <h4>{ms.title}</h4>
                                        <p>{ms.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Leadership Roles Section */}
                    <section className="achievements-section">
                        <h3><FaUserTie /> Leadership & Service Roles</h3>
                        <div className="leadership-table-wrapper">
                            <table className="leadership-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Committee / Board</th>
                                        <th>Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leadershipRoles.map((role, index) => (
                                        <tr key={index}>
                                            <td>{role.year}</td>
                                            <td><strong>{role.position}</strong></td>
                                            <td><span className="role-tag">{role.role}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Achievements;
