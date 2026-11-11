import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import logo from '../assets/adanp-logo.jpg';
import { FaIdCard, FaUserNurse, FaLock, FaDownload, FaPrint, FaSave, FaShieldAlt, FaUser, FaCamera, FaTrash } from 'react-icons/fa';
import { loadPrivateFile } from '../components/FileViewerModal';
import { backendErrorMessage, backendFetch } from '../config/api';
import { getCachedUser, setCachedUser } from '../config/auth';
import './Profile.css';

// The profile (workplace, bio, privacy settings) is saved with profile.php, the photo with
// profile_photo.php and the PRC license with license.php (its expiry date sets the CPD cycle).
// The name and email come from the server and members cannot change them here.

const PHOTO_MAX_BYTES = 2 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png'];

const PRIVACY_SETTINGS = [
    { key: 'privacy_visibility', title: 'Profile Visibility', description: 'Make your profile searchable by other members' },
    { key: 'privacy_show_bio', title: 'Show Professional Bio', description: 'Display your bio in the member directory' },
    { key: 'privacy_show_workplace', title: 'Show Workplace', description: 'Display your current workplace in the member directory' },
    { key: 'privacy_show_email', title: 'Display Email', description: 'Allow members to see your contact email' },
];

const DEFAULT_PRIVACY = { privacy_visibility: true, privacy_show_bio: true, privacy_show_workplace: true, privacy_show_email: false };

// Sends JSON (or FormData) and returns the parsed reply; throws with the server's message on failure
const send = async (path, options) => {
    const response = await backendFetch(path, options);
    const data = await response.json();
    if (!response.ok || data.status !== 'success') throw new Error(data.message || 'Request failed.');
    return data;
};

const postJson = (path, body) => send(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
});

const Profile = () => {
    const [user, setUser] = useState(null);
    const [account, setAccount] = useState({ full_name: '', email: '', member_number: '', member_since: '' });
    const [form, setForm] = useState({
        prc_no: '',
        prc_expiry: '',
        current_workplace: '',
        professional_bio: '',
        ...DEFAULT_PRIVACY,
    });
    const [photoUrl, setPhotoUrl] = useState(null);
    const [photoBusy, setPhotoBusy] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const photoUrlRef = useRef(null);
    const fileInputRef = useRef(null);

    // Photos are private: they load as blob: URLs, which must be released when replaced or unmounted
    const showPhoto = useCallback((url) => {
        if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
        photoUrlRef.current = url;
        setPhotoUrl(url);
    }, []);

    useEffect(() => () => { if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current); }, []);

    const loadPhoto = useCallback(async () => {
        try {
            const { url } = await loadPrivateFile('profile_photo.php');
            showPhoto(url);
        } catch (error) {
            console.error('Error loading profile photo:', error);
        }
    }, [showPhoto]);

    const applyProfile = useCallback((profile) => {
        setAccount({
            full_name: profile.full_name,
            email: profile.email,
            member_number: profile.member_number,
            member_since: profile.member_since,
        });
        setForm((prev) => ({
            ...prev,
            current_workplace: profile.current_workplace,
            professional_bio: profile.professional_bio,
            ...profile.privacy,
        }));
        // Keep the cached name in step with the server so other pages greet the member correctly
        const cached = getCachedUser();
        if (cached && cached.full_name !== profile.full_name) setCachedUser({ ...cached, full_name: profile.full_name });
    }, []);

    useEffect(() => {
        const cached = getCachedUser();
        setUser(cached);
        if (cached) setAccount((prev) => ({ ...prev, full_name: cached.full_name || '', email: cached.email || '' }));

        send('profile.php')
            .then((data) => {
                applyProfile(data.profile);
                if (data.profile.has_photo) loadPhoto();
            })
            .catch((error) => setMessage({ type: 'error', text: backendErrorMessage(error, 'Could not load your profile.') }));

        send('license.php')
            .then((data) => setForm((prev) => ({
                ...prev,
                prc_no: data.license.license_number || '',
                prc_expiry: data.license.expiry_date || '',
            })))
            .catch((error) => console.error('Error loading PRC license:', error));
    }, [applyProfile, loadPhoto]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        e.target.value = ''; // so choosing the same file again still triggers a change
        if (!file) return;
        if (!PHOTO_TYPES.includes(file.type)) {
            setMessage({ type: 'error', text: 'Choose a JPG or PNG photo.' });
            return;
        }
        if (file.size > PHOTO_MAX_BYTES) {
            setMessage({ type: 'error', text: 'The photo is too large. Maximum size is 2 MB.' });
            return;
        }

        setPhotoBusy(true);
        setMessage(null);
        try {
            const body = new FormData();
            body.append('photo', file);
            await send('profile_photo.php', { method: 'POST', body });
            await loadPhoto();
            setMessage({ type: 'success', text: 'Photo updated.' });
        } catch (error) {
            setMessage({ type: 'error', text: backendErrorMessage(error, error.message) });
        } finally {
            setPhotoBusy(false);
        }
    };

    const removePhoto = async () => {
        if (!window.confirm('Remove your profile photo?')) return;
        setPhotoBusy(true);
        setMessage(null);
        try {
            await send('profile_photo.php', { method: 'DELETE' });
            showPhoto(null);
            setMessage({ type: 'success', text: 'Photo removed.' });
        } catch (error) {
            setMessage({ type: 'error', text: backendErrorMessage(error, error.message) });
        } finally {
            setPhotoBusy(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const data = await postJson('profile.php', {
                current_workplace: form.current_workplace,
                professional_bio: form.professional_bio,
                ...Object.fromEntries(PRIVACY_SETTINGS.map(({ key }) => [key, form[key]])),
            });
            applyProfile(data.profile);
        } catch (error) {
            setMessage({ type: 'error', text: `Your profile was not saved: ${backendErrorMessage(error, error.message)}` });
            setIsSaving(false);
            return;
        }

        try {
            await postJson('license.php', { license_number: form.prc_no, expiry_date: form.prc_expiry });
            setMessage({ type: 'success', text: 'Profile saved.' });
        } catch (error) {
            setMessage({ type: 'error', text: `Your profile was saved, but the PRC license was not: ${backendErrorMessage(error, error.message)}` });
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-layout">
            <Sidebar />
            <div className="profile-main-area">
                <header className="profile-topbar">
                    <h2 className="topbar-title">My Profile & Credentials</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{account.full_name}</strong></span>
                    </div>
                </header>

                <div className="profile-content-container">
                    {message && (
                        <p className={`profile-message ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'}>
                            {message.text}
                        </p>
                    )}

                    {/* Digital ID Section */}
                    <section className="profile-card">
                        <h3><FaIdCard /> Digital Membership Card</h3>
                        <div className="id-card-preview">
                            <div className="membership-card">
                                <div className="card-header">
                                    <div className="card-logo">
                                        <img src={logo} alt="ADANP" />
                                        <div className="card-logo-text">
                                            <strong>ADANP</strong>
                                            <span>Official Member</span>
                                        </div>
                                    </div>
                                    <div className="card-chip"></div>
                                </div>
                                <div className="card-body">
                                    <div className="card-photo">
                                        {photoUrl ? (
                                            <img src={photoUrl} alt="Member" />
                                        ) : (
                                            <div className="card-photo-placeholder">
                                                <FaUserNurse size={50} color="#ccc" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="card-info">
                                        <span className="name">{account.full_name || 'Member Name'}</span>
                                        <span className="member-id">{account.member_number || '—'}</span>
                                        {account.member_since && <span className="valid-thru">MEMBER SINCE {account.member_since}</span>}
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <span className="official-badge">Certified Aesthetic Nurse</span>
                                </div>
                            </div>
                            <div className="card-actions">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="photo-input"
                                    aria-label="Profile photo"
                                    onChange={handlePhotoChange}
                                />
                                <button className="action-btn btn-secondary" onClick={() => fileInputRef.current.click()} disabled={photoBusy}>
                                    <FaCamera /> {photoUrl ? 'Change Photo' : 'Upload Photo'}
                                </button>
                                {photoUrl && (
                                    <button className="action-btn btn-secondary" onClick={removePhoto} disabled={photoBusy}>
                                        <FaTrash /> Remove Photo
                                    </button>
                                )}
                            </div>
                            <p className="profile-help">JPG or PNG, up to 2 MB. Only you and ADANP admins can see your photo.</p>
                            <div className="card-actions">
                                <button className="action-btn btn-secondary"><FaPrint /> Print Card</button>
                                <button className="action-btn btn-primary"><FaDownload /> Download PDF</button>
                            </div>
                        </div>
                    </section>

                    {/* Account details: read-only, they come from the membership record */}
                    <section className="profile-card">
                        <h3><FaUser /> Account Details</h3>
                        <div className="form-group">
                            <label htmlFor="profile-full-name">Full Name</label>
                            <input id="profile-full-name" type="text" className="form-control" value={account.full_name} readOnly />
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile-email">Email</label>
                            <input id="profile-email" type="email" className="form-control" value={account.email} readOnly />
                        </div>
                        <p className="profile-help">Your name appears on your membership card. Contact ADANP to correct it.</p>
                    </section>

                    {/* PRC License Section */}
                    <section className="profile-card">
                        <h3><FaShieldAlt /> PRC License Tracking</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="profile-prc-no">PRC License Number</label>
                                <input
                                    id="profile-prc-no"
                                    type="text"
                                    name="prc_no"
                                    className="form-control"
                                    placeholder="0000000"
                                    value={form.prc_no}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="profile-prc-expiry">Expiration Date</label>
                                <input
                                    id="profile-prc-expiry"
                                    type="date"
                                    name="prc_expiry"
                                    className="form-control"
                                    value={form.prc_expiry}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="profile-workplace">Current Workplace</label>
                            <input
                                id="profile-workplace"
                                type="text"
                                name="current_workplace"
                                className="form-control"
                                placeholder="Hospital or Clinic Name"
                                maxLength={255}
                                value={form.current_workplace}
                                onChange={handleInputChange}
                            />
                        </div>
                    </section>

                    {/* Bio Section */}
                    <section className="profile-card">
                        <h3><FaUserNurse /> Professional Bio</h3>
                        <div className="form-group">
                            <label htmlFor="profile-bio">Professional Background</label>
                            <textarea
                                id="profile-bio"
                                name="professional_bio"
                                className="form-control"
                                placeholder="Describe your experience in dermatology and aesthetic nursing..."
                                maxLength={2000}
                                value={form.professional_bio}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>
                    </section>

                    {/* Privacy Settings Section */}
                    <section className="profile-card">
                        <h3><FaLock /> Privacy Settings</h3>
                        <p className="profile-help">Applies once the member directory is available.</p>
                        <div className="settings-list">
                            {PRIVACY_SETTINGS.map(({ key, title, description }) => (
                                <div className="setting-item" key={key}>
                                    <div className="setting-info">
                                        <h4>{title}</h4>
                                        <p>{description}</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name={key}
                                            aria-label={title}
                                            checked={form[key]}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="save-btn-container">
                        <button
                            className="action-btn btn-primary btn-save"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <FaSave /> {isSaving ? 'Saving Changes...' : 'Save All Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
