import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import './Preview.css';

// Temporary page for navigating the UI while the backend is offline.
// Only routed when VITE_PREVIEW_MODE=true; remove once the backend is live.
export const previewEnabled = import.meta.env.VITE_PREVIEW_MODE === 'true';

// Demo users written to the display-only localStorage cache so member-area pages don't redirect to /login.
// The backend never sees these; it still decides access from the session.
const demoUsers = {
  admin_user: { id: 0, email: 'admin@preview.local', role: 'admin_user', full_name: 'Preview Admin' },
  members: { id: 0, email: 'member@preview.local', role: 'members', full_name: 'Preview Member' },
  non_members: { id: 0, email: 'applicant@preview.local', role: 'non_members', full_name: 'Preview Applicant' },
};

// Called on every render of the app so protected pages opened directly by URL (or after logout) still load.
export const ensurePreviewUser = () => {
  if (previewEnabled && !localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(demoUsers.members));
  }
};

const sections = [
  {
    title: 'Public',
    paths: ['/', '/about', '/board', '/certification', '/membership', '/education', '/policy', '/news', '/gallery', '/work-with-us', '/contact', '/login'],
  },
  {
    title: 'Admin',
    role: 'admin_user',
    paths: ['/admin-dashboard', '/gallery-admin'],
  },
  {
    title: 'Member area',
    role: 'members',
    paths: ['/member-dashboard', '/profile', '/cpd', '/library', '/videos', '/logbook', '/legal', '/career', '/forum', '/achievements'],
  },
  {
    title: 'Non-member',
    role: 'non_members',
    paths: ['/non-member-dashboard'],
  },
];

const endpoints = [
  { file: 'login.php', methods: 'POST', auth: 'Public' },
  { file: 'register.php', methods: 'POST', auth: 'Public' },
  { file: 'logout.php', methods: 'POST', auth: 'Public' },
  { file: 'me.php', methods: 'GET', auth: 'Any logged-in user' },
  { file: 'gallery.php', methods: 'GET', auth: 'Public' },
  { file: 'upload.php', methods: 'POST', auth: 'admin_user' },
  { file: 'delete.php', methods: 'POST, DELETE', auth: 'admin_user' },
  { file: 'get_all_applications.php', methods: 'GET', auth: 'admin_user' },
  { file: 'update_application.php', methods: 'POST', auth: 'admin_user' },
  { file: 'get_application_status.php', methods: 'GET', auth: 'non_members' },
  { file: 'submit_application.php', methods: 'POST', auth: 'non_members' },
];

const Preview = () => {
  const enterAs = (role) => {
    if (role) {
      localStorage.setItem('user', JSON.stringify(demoUsers[role]));
    }
  };

  return (
    <div className="preview-page">
      <h1>Page Preview</h1>
      <p className="preview-note">
        Backend-free navigation for checking the UI. A demo member is signed in automatically, so every
        page opens without logging in; links in a role section switch the demo user to that role first.
        Data and actions that need the API will be empty or fail.
      </p>

      {sections.map((section) => (
        <section key={section.title} className="preview-section">
          <h2>
            {section.title}
            {section.role && <span className="preview-role">as {section.role}</span>}
          </h2>
          <ul>
            {section.paths.map((path) => (
              <li key={path}>
                <Link to={path} onClick={() => enterAs(section.role)}>{path}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="preview-section">
        <h2>API endpoints</h2>
        <p className="preview-note">Base URL: <code>{API_BASE_URL || '(not configured)'}</code></p>
        <table className="preview-table">
          <thead>
            <tr><th>Endpoint</th><th>Methods</th><th>Access</th></tr>
          </thead>
          <tbody>
            {endpoints.map((endpoint) => (
              <tr key={endpoint.file}>
                <td><code>{API_BASE_URL ? `${API_BASE_URL}/${endpoint.file}` : endpoint.file}</code></td>
                <td>{endpoint.methods}</td>
                <td>{endpoint.auth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
};

export default Preview;
