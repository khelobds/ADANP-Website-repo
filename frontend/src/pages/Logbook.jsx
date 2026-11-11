import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FaBook, FaPlus, FaChartBar, FaCheckCircle, FaUserCheck, FaWaveSquare, FaTrash, FaTimes } from 'react-icons/fa';
import { backendErrorMessage, backendFetch } from '../config/api';
import { formatDate, todayISO } from '../config/dates';
import './Logbook.css';

const emptyEntry = { procedure_date: '', procedure_type: '', treatment_area: '', patient_code: '', duration_minutes: '', outcome: '' };
const emptyTotals = { total: 0, verified: 0, pending: 0, rejected: 0, this_month: 0, verified_minutes: 0 };

const postJson = async (path, body) => {
    const response = await backendFetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Request failed.');
    return data;
};

// 90 -> '1.5'; whole hours without decimals
const formatHours = (minutes) => String(Math.round((minutes / 60) * 10) / 10);

// Member "Case Logbook": record procedures performed; an admin verifies them (AdminLogbook).
// Patients are identified only by a code the member makes up, and there is no notes field on purpose.
const Logbook = () => {
    const [user, setUser] = useState(null);
    const [entries, setEntries] = useState([]);
    const [totals, setTotals] = useState(emptyTotals);
    const [byProcedure, setByProcedure] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [outcomes, setOutcomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyEntry);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const fetchLogbook = useCallback(async () => {
        setLoadError('');
        try {
            const response = await backendFetch('get_logbook.php');
            const data = await response.json();
            if (data.status !== 'success') throw new Error(data.message);
            setEntries(data.entries);
            setTotals(data.totals);
            setByProcedure(data.by_procedure);
            setProcedures(data.procedures);
            setOutcomes(data.outcomes);
        } catch (error) {
            setLoadError(backendErrorMessage(error, 'Could not load your logbook.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLogbook(); }, [fetchLogbook]);

    const setField = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const submitEntry = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const data = await postJson('submit_logbook.php', form);
            setMessage({ type: 'success', text: data.message });
            setForm(emptyEntry);
            setShowForm(false);
            fetchLogbook();
        } catch (error) {
            setMessage({ type: 'error', text: backendErrorMessage(error, error.message) });
        } finally {
            setSaving(false);
        }
    };

    const deleteEntry = async (entry) => {
        if (!window.confirm(`Delete the ${entry.procedure_type} entry for ${entry.patient_code} on ${formatDate(entry.procedure_date)}?`)) return;
        try {
            await postJson('delete_logbook.php', { id: entry.id });
            fetchLogbook();
        } catch (error) {
            alert(backendErrorMessage(error, error.message));
        }
    };

    if (!user) return null;

    const maxCount = Math.max(1, ...byProcedure.map((row) => row.count));

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
                    {loadError && <p className="logbook-message error">{loadError}</p>}

                    {/* Stats Grid */}
                    <div className="logbook-stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon-circle"><FaBook /></div>
                            <div className="stat-info">
                                <h4>Total Logs</h4>
                                <div className="stat-value" data-testid="stat-total">{totals.total}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-circle" style={{ background: '#e6fffa', color: '#319795' }}><FaUserCheck /></div>
                            <div className="stat-info">
                                <h4>Verified Hours</h4>
                                <div className="stat-value" data-testid="stat-hours">{formatHours(totals.verified_minutes)}h</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-circle" style={{ background: '#fffaf0', color: '#dd6b20' }}><FaWaveSquare /></div>
                            <div className="stat-info">
                                <h4>This Month</h4>
                                <div className="stat-value" data-testid="stat-month">+{totals.this_month}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon-circle" style={{ background: '#fef2f2', color: '#ef4444' }}><FaCheckCircle /></div>
                            <div className="stat-info">
                                <h4>Pending Sign-off</h4>
                                <div className="stat-value" data-testid="stat-pending">{totals.pending}</div>
                            </div>
                        </div>
                    </div>

                    {/* Procedures chart: entries per procedure, rejected entries left out */}
                    <div className="logbook-chart-section">
                        <div className="chart-header">
                            <h3><FaChartBar /> Procedure Variety</h3>
                            <span className="chart-subtitle">Entries per procedure (rejected entries not counted)</span>
                        </div>
                        {byProcedure.length === 0 ? (
                            <p className="logbook-empty">No procedures logged yet.</p>
                        ) : (
                            <ul className="procedure-bars">
                                {byProcedure.map((row) => (
                                    <li key={row.procedure}>
                                        <span className="procedure-name">{row.procedure}</span>
                                        <span className="procedure-track">
                                            <span className="procedure-fill" style={{ width: `${(row.count / maxCount) * 100}%` }} />
                                        </span>
                                        <span className="procedure-count">{row.count}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Entries table */}
                    <div className="logbook-table-section">
                        <div className="table-header">
                            <h3>Patient Logs (Anonymized)</h3>
                            <button className="btn-add-entry" onClick={() => { setShowForm(!showForm); setMessage(null); }}>
                                {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Entry</>}
                            </button>
                        </div>

                        {message && <p className={`logbook-message ${message.type}`}>{message.text}</p>}

                        {showForm && (
                            <form className="logbook-form" onSubmit={submitEntry} aria-label="New logbook entry">
                                <div className="logbook-form-grid">
                                    <label>
                                        Procedure date
                                        <input type="date" name="procedure_date" required max={todayISO()} value={form.procedure_date} onChange={setField} />
                                    </label>
                                    <label>
                                        Procedure
                                        <select name="procedure_type" required value={form.procedure_type} onChange={setField}>
                                            <option value="">Choose a procedure</option>
                                            {procedures.map((name) => <option key={name} value={name}>{name}</option>)}
                                        </select>
                                    </label>
                                    <label>
                                        Area treated (optional)
                                        <input type="text" name="treatment_area" maxLength={100} placeholder="e.g. Forehead" value={form.treatment_area} onChange={setField} />
                                    </label>
                                    <label>
                                        Patient code
                                        <input
                                            type="text"
                                            name="patient_code"
                                            required
                                            maxLength={20}
                                            pattern="(?=.*[0-9])[A-Za-z0-9\-]+"
                                            title="Letters, digits and dashes, including at least one digit (e.g. P-0042)"
                                            placeholder="e.g. P-0042"
                                            value={form.patient_code}
                                            onChange={setField}
                                        />
                                    </label>
                                    <label>
                                        Duration in minutes (optional)
                                        <input type="number" name="duration_minutes" min="1" max="1440" step="1" value={form.duration_minutes} onChange={setField} />
                                    </label>
                                    <label>
                                        Outcome
                                        <select name="outcome" required value={form.outcome} onChange={setField}>
                                            <option value="">Choose an outcome</option>
                                            {outcomes.map((name) => <option key={name} value={name}>{name}</option>)}
                                        </select>
                                    </label>
                                </div>
                                <p className="logbook-help">
                                    Use your own code for the patient. Never enter a patient&apos;s name or other details.
                                    New entries wait for an ADANP admin to verify them.
                                </p>
                                <button type="submit" className="btn-add-entry" disabled={saving}>
                                    {saving ? 'Saving...' : 'Add Entry'}
                                </button>
                            </form>
                        )}

                        <div className="table-wrapper">
                            <table className="logbook-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Patient Code</th>
                                        <th>Procedure</th>
                                        <th>Duration</th>
                                        <th>Outcome</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading && <tr><td colSpan="7" className="logbook-empty">Loading...</td></tr>}
                                    {!loading && entries.length === 0 && (
                                        <tr><td colSpan="7" className="logbook-empty">No entries yet. Use New Entry to log a procedure.</td></tr>
                                    )}
                                    {entries.map((entry) => (
                                        <tr key={entry.id}>
                                            <td>{formatDate(entry.procedure_date)}</td>
                                            <td><strong>{entry.patient_code}</strong></td>
                                            <td>
                                                {entry.procedure_type}
                                                {entry.treatment_area && <span className="logbook-sub">{entry.treatment_area}</span>}
                                            </td>
                                            <td>{entry.duration_minutes ? `${entry.duration_minutes} min` : '-'}</td>
                                            <td>{entry.outcome}</td>
                                            <td>
                                                <span className={`status-badge ${entry.status.toLowerCase()}`}>{entry.status}</span>
                                                {entry.status === 'Rejected' && entry.review_note && (
                                                    <span className="logbook-sub rejected-note">Reason: {entry.review_note}</span>
                                                )}
                                            </td>
                                            <td>
                                                {entry.status === 'Verified' ? (
                                                    <span className="signed-off"><FaCheckCircle /> Signed off</span>
                                                ) : (
                                                    <button className="btn-delete-entry" onClick={() => deleteEntry(entry)}>
                                                        <FaTrash /> Delete
                                                    </button>
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
