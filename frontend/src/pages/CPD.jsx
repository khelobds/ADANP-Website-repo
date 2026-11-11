import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import FileViewerModal, { loadPrivateFile } from '../components/FileViewerModal';
import { FaGraduationCap, FaAward, FaCloudUploadAlt, FaEye, FaTrash } from 'react-icons/fa';
import { backendErrorMessage, backendFetch } from '../config/api';
import { getCachedUser } from '../config/auth';
import { formatDate, todayISO } from '../config/dates';
import './CPD.css';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const emptyForm = { title: '', provider: '', activity_date: '', units: '' };

const STATUS_LABELS = {
    compliant: { text: 'COMPLIANT', className: 'ok' },
    expired: { text: 'LICENSE EXPIRED', className: 'bad' },
    progress: { text: 'IN PROGRESS', className: 'progress' },
};

const CPD = () => {
    const [user] = useState(getCachedUser);
    const [summary, setSummary] = useState(null);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [form, setForm] = useState(emptyForm);
    const [file, setFile] = useState(null);
    const [formMessage, setFormMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInput = useRef(null);

    const [viewing, setViewing] = useState(null);

    const load = useCallback(async () => {
        try {
            const response = await backendFetch('get_cpd.php');
            const data = await response.json();
            if (!response.ok || data.status !== 'success') throw new Error(data.message);
            setSummary(data.summary);
            setRecords(data.records);
            setLoadError('');
        } catch (error) {
            setLoadError(backendErrorMessage(error, 'Could not load your CPD records.'));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const chooseFile = (e) => {
        const chosen = e.target.files[0] || null;
        if (chosen && chosen.size > MAX_FILE_BYTES) {
            setFormMessage({ type: 'error', text: 'The certificate must be 5 MB or smaller.' });
            e.target.value = '';
            setFile(null);
            return;
        }
        setFormMessage(null);
        setFile(chosen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setFormMessage({ type: 'error', text: 'Attach your certificate (PDF, JPG or PNG).' });
            return;
        }

        const body = new FormData();
        Object.entries(form).forEach(([key, value]) => body.append(key, value));
        body.append('certificate', file);

        setSubmitting(true);
        setFormMessage(null);
        try {
            const response = await backendFetch('submit_cpd.php', { method: 'POST', body });
            const data = await response.json();
            if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Submission failed.');
            setFormMessage({ type: 'success', text: 'Submitted. Your units will count once an admin approves them.' });
            setForm(emptyForm);
            setFile(null);
            if (fileInput.current) fileInput.current.value = '';
            load();
        } catch (error) {
            setFormMessage({ type: 'error', text: backendErrorMessage(error, error.message) });
        } finally {
            setSubmitting(false);
        }
    };

    const deleteRecord = async (record) => {
        if (!window.confirm(`Delete your submission "${record.title}"?`)) return;
        try {
            const response = await backendFetch('delete_cpd.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: record.id }),
            });
            const data = await response.json();
            if (!response.ok || data.status !== 'success') throw new Error(data.message);
            load();
        } catch (error) {
            alert(backendErrorMessage(error, error.message || 'Could not delete the submission.'));
        }
    };

    const viewCertificate = async (id) => {
        try {
            setViewing(await loadPrivateFile(`cpd_certificate.php?id=${id}`));
        } catch (error) {
            alert(backendErrorMessage(error, 'Could not load the certificate.'));
        }
    };

    const renderTracker = () => {
        if (loading) return <p className="tracker-legend">Loading your CPD progress...</p>;
        if (loadError) return <p className="cpd-message error">{loadError}</p>;

        if (!summary.cycle) {
            return (
                <div className="cpd-notice">
                    Add your PRC license expiration date in <Link to="/profile">My Profile</Link> to start
                    tracking. Your CPD cycle is the {summary.required_units}-unit, 3-year period before that date.
                </div>
            );
        }

        const { approved_units: approved, pending_units: pending, required_units: required, cycle } = summary;
        const percent = Math.min(100, Math.round((approved / required) * 100));
        const state = summary.compliant ? 'compliant' : summary.license_expired ? 'expired' : 'progress';

        return (
            <div className="tracker-container">
                <div className="tracker-stats">
                    <div className="stat-group">
                        <span className="label">Approved Units This Cycle</span>
                        <div className="value">
                            {approved} <span className="total">/ {required} Units</span>
                        </div>
                    </div>
                    <div className="stat-group" style={{ textAlign: 'right' }}>
                        <span className="label">Requirement Status</span>
                        <span className={`cpd-state ${STATUS_LABELS[state].className}`}>{STATUS_LABELS[state].text}</span>
                    </div>
                </div>
                <div className="progress-bar-wrapper" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-fill" style={{ width: `${percent}%` }}>
                        {percent}%
                    </div>
                </div>
                <p className="tracker-legend">
                    Renewal cycle: <strong>{formatDate(cycle.start)}</strong> to <strong>{formatDate(cycle.end)}</strong>.{' '}
                    {state === 'compliant' && <>You have met the {required}-unit requirement for this cycle.</>}
                    {state === 'expired' && <>Your license expired. After renewing, update the expiration date in <Link to="/profile">My Profile</Link>.</>}
                    {state === 'progress' && <>You need <strong>{summary.remaining_units}</strong> more units for your license renewal.</>}
                    {pending > 0 && <> <strong>{pending}</strong> units are waiting for admin review.</>}
                </p>
            </div>
        );
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
                    <section className="cpd-section">
                        <h3><FaAward /> CPD Progress Tracker</h3>
                        {renderTracker()}
                    </section>

                    <section className="cpd-section">
                        <h3><FaGraduationCap /> Certificate Vault</h3>
                        {!loading && !loadError && records.length === 0 && (
                            <p className="tracker-legend">No CPD records yet. Submit your first certificate below.</p>
                        )}
                        <div className="vault-grid">
                            {records.map((record) => (
                                <div key={record.id} className="cert-card">
                                    <div className="cert-preview">
                                        {record.source === 'adanp'
                                            ? <FaAward size={60} color="#e2c48f" />
                                            : <FaGraduationCap size={60} color="#cbd5e0" />}
                                        {record.has_certificate && (
                                            <div className="cert-overlay">
                                                <button className="view-cert-btn" onClick={() => viewCertificate(record.id)}>
                                                    <FaEye /> View
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="cert-info">
                                        <span className="issuer">{record.source === 'adanp' ? 'ADANP Seminar' : record.provider}</span>
                                        <h4>{record.title}</h4>
                                        <span className="date">{formatDate(record.activity_date)} · {record.units} units</span>
                                        <div className="cert-meta">
                                            <span className={`cpd-badge ${record.status.toLowerCase()}`}>{record.status}</span>
                                            {!record.in_cycle && summary?.cycle && <span className="cpd-outside">Outside current cycle</span>}
                                            {record.status === 'Pending' && (
                                                <button className="cert-delete-btn" onClick={() => deleteRecord(record)} aria-label={`Delete ${record.title}`}>
                                                    <FaTrash /> Delete
                                                </button>
                                            )}
                                        </div>
                                        {record.status === 'Rejected' && record.review_note && (
                                            <p className="cert-note">Reason: {record.review_note}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="cpd-section">
                        <h3><FaCloudUploadAlt /> Submit an External Certificate</h3>
                        <form className="cpd-form" onSubmit={handleSubmit}>
                            <div className="cpd-form-grid">
                                <label>
                                    Training title
                                    <input
                                        type="text"
                                        required
                                        maxLength={255}
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Provider
                                    <input
                                        type="text"
                                        required
                                        maxLength={255}
                                        value={form.provider}
                                        onChange={(e) => setForm({ ...form, provider: e.target.value })}
                                    />
                                </label>
                                <label>
                                    Date attended
                                    <input
                                        type="date"
                                        required
                                        max={todayISO()}
                                        value={form.activity_date}
                                        onChange={(e) => setForm({ ...form, activity_date: e.target.value })}
                                    />
                                </label>
                                <label>
                                    CPD units
                                    <input
                                        type="number"
                                        required
                                        min="0.01"
                                        max="50"
                                        step="0.01"
                                        value={form.units}
                                        onChange={(e) => setForm({ ...form, units: e.target.value })}
                                    />
                                </label>
                            </div>

                            <label className="upload-area">
                                <input
                                    ref={fileInput}
                                    type="file"
                                    className="hidden-input"
                                    aria-label="Certificate file"
                                    onChange={chooseFile}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <div className="upload-icon">
                                    <FaCloudUploadAlt />
                                </div>
                                <div className="upload-text">
                                    <h4>{file ? file.name : 'Click to choose your certificate'}</h4>
                                    <p>PDF, PNG or JPG, up to 5 MB</p>
                                </div>
                            </label>

                            {formMessage && <p className={`cpd-message ${formMessage.type}`}>{formMessage.text}</p>}

                            <div className="upload-actions">
                                <button type="submit" className="btn-upload" disabled={submitting}>
                                    <FaCloudUploadAlt /> {submitting ? 'Submitting...' : 'Submit for Review'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>

            <FileViewerModal file={viewing} title="CPD Certificate" onClose={() => setViewing(null)} />
        </div>
    );
};

export default CPD;
