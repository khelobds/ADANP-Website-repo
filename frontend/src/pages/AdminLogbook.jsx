import { useCallback, useEffect, useState } from 'react';
import { backendErrorMessage, backendFetch } from '../config/api';
import { formatDate } from '../config/dates';
import './AdminCpd.css';

const STATUSES = ['Pending', 'Verified', 'Rejected'];

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

// Admin "Logbook" tab: verify or reject members' logbook entries. Shares its styles with the CPD tab.
const AdminLogbook = () => {
  const [status, setStatus] = useState('Pending');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const response = await backendFetch(`get_logbook_submissions.php?status=${status}`);
      const data = await response.json();
      if (data.status !== 'success') throw new Error(data.message);
      setEntries(data.entries);
    } catch (error) {
      setEntries([]);
      setListError(backendErrorMessage(error, 'Could not load logbook entries.'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const review = async (entry, action) => {
    let note = '';
    if (action === 'Reject') {
      note = window.prompt(`Reason for rejecting ${entry.full_name}'s ${entry.procedure_type} entry (shown to the member):`);
      if (note === null) return;
      if (!note.trim()) {
        alert('A reason is required to reject an entry.');
        return;
      }
    } else if (!window.confirm(`Verify ${entry.full_name}'s ${entry.procedure_type} entry from ${formatDate(entry.procedure_date)}?`)) {
      return;
    }

    try {
      await postJson('review_logbook.php', { id: entry.id, action, note });
      fetchEntries();
    } catch (error) {
      alert(backendErrorMessage(error, error.message));
    }
  };

  return (
    <div className="admin-cpd">
      <div className="admin-content-card">
        <h2>Logbook Entries</h2>
        <div className="cpd-status-tabs" role="tablist">
          {STATUSES.map((value) => (
            <button
              key={value}
              role="tab"
              aria-selected={status === value}
              className={`cpd-status-tab ${status === value ? 'active' : ''}`}
              onClick={() => setStatus(value)}
            >
              {value}
            </button>
          ))}
        </div>

        {listError && <p className="cpd-admin-message error">{listError}</p>}

        <div className="applicants-table-wrapper">
          <table className="applicants-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Procedure</th>
                <th>Date</th>
                <th>Patient Code</th>
                <th>Duration</th>
                <th>Outcome</th>
                <th>{status === 'Pending' ? 'Actions' : 'Review'}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="7" className="cpd-empty">Loading...</td></tr>
              )}
              {!loading && entries.length === 0 && (
                <tr><td colSpan="7" className="cpd-empty">No {status.toLowerCase()} entries.</td></tr>
              )}
              {!loading && entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <strong>{entry.full_name}</strong>
                    <span className="cpd-sub">{entry.email}</span>
                  </td>
                  <td>
                    {entry.procedure_type}
                    {entry.treatment_area && <span className="cpd-sub">{entry.treatment_area}</span>}
                  </td>
                  <td>{formatDate(entry.procedure_date)}</td>
                  <td>{entry.patient_code}</td>
                  <td>{entry.duration_minutes ? `${entry.duration_minutes} min` : '-'}</td>
                  <td>{entry.outcome}</td>
                  <td>
                    {entry.status === 'Pending' ? (
                      <>
                        <button className="approve-btn" onClick={() => review(entry, 'Verify')}>Verify</button>
                        <button className="reject-btn" onClick={() => review(entry, 'Reject')}>Reject</button>
                      </>
                    ) : (
                      <>
                        <span className={`cpd-badge ${entry.status.toLowerCase()}`}>{entry.status}</span>
                        {entry.review_note && <span className="cpd-sub">{entry.review_note}</span>}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminLogbook;
