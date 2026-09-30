import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaBook, FaPlus, FaChartBar, FaCheckCircle, FaUserCheck, FaMicroscope, FaSyringe, FaWaveSquare } from 'react-icons/fa';
import './Logbook.css';

const Logbook = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [logs, setLogs] = useState([
        { id: 1, date: '2024-04-10', procedure: 'Chemical Peel (Glycolic 30%)', patient: 'P-001', outcome: 'Successful', status: 'verified' },
        { id: 2, date: '2024-04-12', procedure: 'Laser Hair Removal', patient: 'P-002', outcome: 'Successful', status: 'verified' },
        { id: 3, date: '2024-04-15', procedure: 'Botulinum Toxin Injection', patient: 'P-003', outcome: 'Minor swelling', status: 'pending' },
        { id: 4, date: '2024-04-18', procedure: 'Dermal Filler (Nasolabial)', patient: 'P-004', outcome: 'Excellent', status: 'pending' },
        { id: 5, date: '2024-04-20', procedure: 'Microneedling', patient: 'P-005', outcome: 'Successful', status: 'pending' }
    ]);

    const stats = {
        total: 124,
        thisMonth: 15,
        verifiedHours: 42,
        pendingVerification: 12
    };

    const categories = [
        { name: 'Peels', value: 35 },
        { name: 'Laser', value: 45 },
        { name: 'Injectables', value: 25 },
        { name: 'Facials', value: 15 },
        { name: 'Other', value: 8 }
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleRequestVerification = (id) => {
        alert(`Verification request sent for log entry #${id} to your supervisor.`);
    };

    if (!user) return null;

    return (
        <div className="logbook-layout">
            <Sidebar />
            <div className="logbook-main-area">
                <header className="logbook-topbar">
                    <h2 className="topbar-title">Case Logbook</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="logbook-content-container">
                    {/* Stats Grid */}
                    <div className="logbook-stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon-circle"><FaBook /></div>
                            <div className="stat-info">
                                <h4>Total Logs</h4>
                                <div className="stat-value">{stats.total}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-circle" style={{ background: '#e6fffa', color: '#319795' }}><FaUserCheck /></div>
                            <div className="stat-info">
                                <h4>Verified Hours</h4>
                                <div className="stat-value">{stats.verifiedHours}h</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-circle" style={{ background: '#fffaf0', color: '#dd6b20' }}><FaWaveSquare /></div>
                            <div className="stat-info">
                                <h4>This Month</h4>
                                <div className="stat-value">+{stats.thisMonth}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-circle" style={{ background: '#fef2f2', color: '#ef4444' }}><FaCheckCircle /></div>
                            <div className="stat-info">
                                <h4>Pending Sign-off</h4>
                                <div className="stat-value">{stats.pendingVerification}</div>
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="logbook-chart-section">
                        <div className="chart-header">
                            <h3><FaChartBar /> Procedure Variety</h3>
                            <span style={{ fontSize: '0.8rem', color: '#718096' }}>Distribution of logs by category</span>
                        </div>
                        <div className="chart-bars">
                            {categories.map((cat, index) => (
                                <div key={index} className="bar-wrapper">
                                    <div 
                                        className="bar-fill" 
                                        style={{ height: `${(cat.value / 50) * 100}%` }}
                                        data-value={cat.value}
                                    ></div>
                                    <span className="bar-label">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Patient Logs Table */}
                    <div className="logbook-table-section">
                        <div className="table-header">
                            <h3>Patient Logs (Anonymized)</h3>
                            <button className="btn-add-entry"><FaPlus /> New Entry</button>
                        </div>
                        <div className="table-wrapper">
                            <table className="logbook-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient ID</th>
                                        <th>Procedure</th>
                                        <th>Outcome</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map(log => (
                                        <tr key={log.id}>
                                            <td>{log.date}</td>
                                            <td><strong>{log.patient}</strong></td>
                                            <td>{log.procedure}</td>
                                            <td>{log.outcome}</td>
                                            <td>
                                                <span className={`status-badge ${log.status}`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                            <td>
                                                {log.status === 'pending' && (
                                                    <button 
                                                        className="btn-verify"
                                                        onClick={() => handleRequestVerification(log.id)}
                                                    >
                                                        Request Sign-off
                                                    </button>
                                                )}
                                                {log.status === 'verified' && (
                                                    <span style={{ color: '#319795', fontSize: '0.8rem' }}>
                                                        <FaCheckCircle /> Signed off
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logbook;
