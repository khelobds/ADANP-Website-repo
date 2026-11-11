import { useCallback, useEffect, useState } from 'react';
import FileViewerModal, { loadPrivateFile } from '../components/FileViewerModal';
import { backendErrorMessage, backendFetch } from '../config/api';
import { formatDate, todayISO } from '../config/dates';
import './AdminCpd.css';

const STATUSES = ['Pending', 'Approved', 'Rejected'];
const emptySeminar = { title: '', event_date: '', units: '' };

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

// Admin "CPD" tab: review member CPD submissions and credit attendees of ADANP-run seminars.
const AdminCpd = () => {
  const [status, setStatus] = useState('Pending');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [viewing, setViewing] = useState(null);

  const [members, setMembers] = useState([]);
  const [memberFilter, setMemberFilter] = useState('');
  const [seminar, setSeminar] = useState(emptySeminar);
  const [attendees, setAttendees] = useState(() => new Set());
  const [seminarMessage, setSeminarMessage] = useState(null);
  const [savingSeminar, setSavingSeminar] = useState(false);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const response = await backendFetch(`get_cpd_submissions.php?status=${status}`);
      const data = await response.json();
      if (data.status !== 'success') throw new Error(data.message);
      setRecords(data.records);
    } catch (error) {
      setRecords([]);
      setListError(backendErrorMessage(error, 'Could not load CPD submissions.'));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  useEffect(() => {
    backendFetch('get_members.php')
      .then((response) => response.json())
      .then((data) => { if (data.status === 'success') setMembers(data.members); })
      .catch((error) => console.error('Error loading members:', error));
  }, []);

  const viewCertificate = async (id) => {
    try {
      setViewing(await loadPrivateFile(`cpd_certificate.php?id=${id}`));
    } catch (error) {
      alert(backendErrorMessage(error, 'Could not load the certificate.'));
    }
  };

  const review = async (record, action) => {
    let note = '';
    if (action === 'Reject') {
      note = window.prompt(`Reason for rejecting "${record.title}" (shown to the member):`);
      if (note === null) return;
      if (!note.trim()) {
        alert('A reason is required to reject a submission.');
        return;
      }
    } else if (!window.confirm(`Approve ${record.units} units for ${record.full_name}?`)) {
      return;
    }

    try {
      await postJson('review_cpd.php', { id: record.id, action, note });
      fetchRecords();
    } catch (error) {
      alert(backendErrorMessage(error, error.message));
    }
  };

  const toggleAttendee = (id) => {
    setAttendees((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const visibleMembers = members.filter((member) => (
    `${member.full_name} ${member.email}`.toLowerCase().includes(memberFilter.trim().toLowerCase())
  ));

  const selectAllVisible = () => {
    setAttendees((current) => new Set([...current, ...visibleMembers.map((member) => member.id)]));
  };

  const submitSeminar = async (e) => {
    e.preventDefault();
    setSeminarMessage(null);
    if (attendees.size === 0) {
      setSeminarMessage({ type: 'error', text: 'Select at least one attendee.' });
      return;
    }

    setSavingSeminar(true);
    try {
      const data = await postJson('create_cpd_event.php', { ...seminar, member_ids: [...attendees] });
      setSeminarMessage({ type: 'success', text: data.message });
      setSeminar(emptySeminar);
      setAttendees(new Set());
    } catch (error) {
      setSeminarMessage({ type: 'error', text: backendErrorMessage(error, error.message) });
    } finally {
      setSavingSeminar(false);
    }
  };

  return (
    <div className="admin-cpd">
      <div className="admin-content-card">
        <h2>CPD Submissions</h2>
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
                <th>Training</th>
                <th>Date</th>
                <th>Units</th>
                <th>Certificate</th>
                <th>{status === 'Pending' ? 'Actions' : 'Review'}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="6" className="cpd-empty">Loading...</td></tr>
              )}
              {!loading && records.length === 0 && (
                <tr><td colSpan="6" className="cpd-empty">No {status.toLowerCase()} submissions.</td></tr>
              )}
              {!loading && records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <strong>{record.full_name}</strong>
                    <span className="cpd-sub">{record.email}</span>
                  </td>
                  <td>
                    {record.title}
                    <span className="cpd-sub">{record.provider}</span>
                  </td>
                  <td>{formatDate(record.activity_date)}</td>
                  <td>{record.units}</td>
                  <td>
                    {record.has_certificate && (
                      <button className="view-btn" onClick={() => viewCertificate(record.id)}>View</button>
                    )}
                  </td>
                  <td>
                    {record.status === 'Pending' ? (
                      <>
                        <button className="approve-btn" onClick={() => review(record, 'Approve')}>Approve</button>
                        <button className="reject-btn" onClick={() => review(record, 'Reject')}>Reject</button>
                      </>
                    ) : (
                      <>
                        <span className={`cpd-badge ${record.status.toLowerCase()}`}>{record.status}</span>
                        {record.review_note && <span className="cpd-sub">{record.review_note}</span>}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form className="admin-content-card cpd-seminar-form" onSubmit={submitSeminar}>
        <h2>Credit an ADANP Seminar</h2>
        <p className="cpd-help">Attendees get approved CPD units right away; no certificate upload or review is needed.</p>

        <div className="cpd-form-row">
          <label>
            Seminar title
            <input
              type="text"
              required
              maxLength={255}
              value={seminar.title}
              onChange={(e) => setSeminar({ ...seminar, title: e.target.value })}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              required
              max={todayISO()}
              value={seminar.event_date}
              onChange={(e) => setSeminar({ ...seminar, event_date: e.target.value })}
            />
          </label>
          <label>
            Units
            <input
              type="number"
              required
              min="0.01"
              max="50"
              step="0.01"
              value={seminar.units}
              onChange={(e) => setSeminar({ ...seminar, units: e.target.value })}
            />
          </label>
        </div>

        <div className="cpd-attendees">
          <div className="cpd-attendees-header">
            <strong>Attendees ({attendees.size} selected)</strong>
            <input
              type="search"
              placeholder="Search members"
              aria-label="Search members"
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
            />
            <button type="button" className="cpd-link-btn" onClick={selectAllVisible}>Select all shown</button>
            <button type="button" className="cpd-link-btn" onClick={() => setAttendees(new Set())}>Clear</button>
          </div>
          <ul className="cpd-attendee-list">
            {visibleMembers.map((member) => (
              <li key={member.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={attendees.has(member.id)}
                    onChange={() => toggleAttendee(member.id)}
                  />
                  {member.full_name} <span className="cpd-sub-inline">{member.email}</span>
                </label>
              </li>
            ))}
            {visibleMembers.length === 0 && <li className="cpd-empty">No members found.</li>}
          </ul>
        </div>

        {seminarMessage && <p className={`cpd-admin-message ${seminarMessage.type}`}>{seminarMessage.text}</p>}
        <button type="submit" className="approve-btn cpd-submit" disabled={savingSeminar}>
          {savingSeminar ? 'Saving...' : 'Record seminar and credit attendees'}
        </button>
      </form>

      <FileViewerModal file={viewing} title="CPD Certificate" onClose={() => setViewing(null)} />
    </div>
  );
};

export default AdminCpd;
