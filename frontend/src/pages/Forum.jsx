import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaComments, FaUsers, FaPoll, FaSearch, FaStethoscope, FaBriefcase, FaGraduationCap, FaQuestionCircle } from 'react-icons/fa';
import './Forum.css';

const Forum = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = [
        { id: 1, title: 'Clinical Advice & Techniques', desc: 'Share insights on procedures and patient care.', threads: 156, posts: 842, icon: <FaStethoscope /> },
        { id: 2, title: 'Business & Practice Management', desc: 'Discuss clinic operations, marketing, and growth.', threads: 89, posts: 412, icon: <FaBriefcase /> },
        { id: 3, title: 'Education & CPD Opportunities', desc: 'Information on upcoming seminars and training.', threads: 45, posts: 215, icon: <FaGraduationCap /> },
        { id: 4, title: 'General Lounge', desc: 'Casual networking and off-topic discussions.', threads: 210, posts: '1.5k', icon: <FaComments /> }
    ];

    const members = [
        { id: 1, name: 'Dr. Elena Cruz', role: 'Fellow Member', location: 'Manila' },
        { id: 2, name: 'RN. Mark Santos', role: 'Official Member', location: 'Cebu' },
        { id: 3, name: 'Dr. Sarah Lim', role: 'Board Member', location: 'Makati' },
        { id: 4, name: 'RN. Jane Doe', role: 'Official Member', location: 'Davao' },
        { id: 5, name: 'Dr. John Watson', role: 'Fellow Member', location: 'Quezon City' }
    ];

    const poll = {
        question: "What topic should our next clinical webinar focus on?",
        options: [
            { label: "Advanced Botulinum Toxin", votes: 45 },
            { label: "Vascular Occlusion Safety", votes: 38 },
            { label: "Clinic Marketing Growth", votes: 22 },
            { label: "New Laser Technologies", votes: 15 }
        ]
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user) return null;

    return (
        <div className="forum-layout">
            <Sidebar />
            <div className="forum-main-area">
                <header className="forum-topbar">
                    <h2 className="topbar-title">Community Forum</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="forum-content-container">
                    <div className="forum-left-col">
                        {/* Discussion Boards Section */}
                        <section className="forum-section">
                            <h3><FaComments /> Discussion Boards</h3>
                            <div className="forum-categories">
                                {categories.map(cat => (
                                    <div key={cat.id} className="category-item">
                                        <div className="cat-main">
                                            <div className="cat-icon">{cat.icon}</div>
                                            <div className="cat-text">
                                                <h4>{cat.title}</h4>
                                                <p>{cat.desc}</p>
                                            </div>
                                        </div>
                                        <div className="cat-stats">
                                            <div>{cat.threads} Threads</div>
                                            <div>{cat.posts} Posts</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Polls & Surveys Section */}
                        <section className="forum-section">
                            <h3><FaPoll /> Polls & Surveys</h3>
                            <div className="poll-widget">
                                <span className="poll-question">{poll.question}</span>
                                {poll.options.map((opt, index) => {
                                    const totalVotes = poll.options.reduce((acc, current) => acc + current.votes, 0);
                                    const percentage = Math.round((opt.votes / totalVotes) * 100);
                                    return (
                                        <div key={index} className="poll-option">
                                            <div className="poll-option-label">
                                                <span>{opt.label}</span>
                                                <span>{percentage}%</span>
                                            </div>
                                            <div className="poll-bar-bg">
                                                <div className="poll-bar-fill" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button className="btn-vote">Submit Feedback</button>
                            </div>
                        </section>
                    </div>

                    <div className="forum-right-col">
                        {/* Member Directory Section */}
                        <section className="forum-section">
                            <h3><FaUsers /> Member Directory</h3>
                            <div className="search-box">
                                <FaSearch className="search-icon" />
                                <input 
                                    type="text" 
                                    placeholder="Search members..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="member-list">
                                {filteredMembers.length > 0 ? (
                                    filteredMembers.map(member => (
                                        <div key={member.id} className="member-mini-card">
                                            <div className="member-avatar">
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="member-info-mini">
                                                <h5>{member.name}</h5>
                                                <span>{member.role} • {member.location}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', color: '#718096', fontSize: '0.85rem' }}>No members found.</p>
                                )}
                            </div>
                        </section>

                        {/* Forum Guidelines Section */}
                        <section className="forum-section" style={{ background: '#f8fafc' }}>
                            <h3><FaQuestionCircle /> Community Guidelines</h3>
                            <ul style={{ fontSize: '0.8rem', color: '#64748b', paddingLeft: '20px', lineHeight: '1.6' }}>
                                <li>Be professional and respectful.</li>
                                <li>No patient identifying information.</li>
                                <li>Follow medical ethics at all times.</li>
                                <li>No direct advertising or spam.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
