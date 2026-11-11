import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import CPD from './CPD';
import AdminCpd from './AdminCpd';
import { backendFetch } from '../config/api';

vi.mock('../config/api', () => ({
  backendFetch: vi.fn(),
  backendErrorMessage: (error, fallback) => fallback,
}));

const json = (body, status = 200) => Promise.resolve({ ok: status < 300, status, json: async () => body });

const summary = (overrides = {}) => ({
  license: { license_number: '0123456', expiry_date: '2027-05-10' },
  cycle: { start: '2024-05-10', end: '2027-05-10' },
  license_expired: false,
  required_units: 45,
  approved_units: 18,
  pending_units: 4.5,
  remaining_units: 27,
  compliant: false,
  ...overrides,
});

const records = [
  { id: 1, title: 'Laser Safety Course', provider: 'PDS', activity_date: '2025-03-01', units: 4.5, source: 'external', status: 'Pending', review_note: null, has_certificate: true, in_cycle: true },
  { id: 2, title: 'ADANP Annual Convention', provider: 'ADANP', activity_date: '2025-01-15', units: 18, source: 'adanp', status: 'Approved', review_note: null, has_certificate: false, in_cycle: true },
  { id: 3, title: 'Old Workshop', provider: 'Clinic', activity_date: '2023-01-01', units: 2, source: 'external', status: 'Rejected', review_note: 'Certificate unreadable', has_certificate: true, in_cycle: false },
];

const renderCpd = () => render(<MemoryRouter><CPD /></MemoryRouter>);

describe('CPD page', () => {
  beforeEach(() => localStorage.setItem('user', JSON.stringify({ id: 7, role: 'members', full_name: 'Ana Cruz' })));
  afterEach(() => { vi.clearAllMocks(); localStorage.clear(); });

  it('shows approved units, the cycle, pending units and each record from the server', async () => {
    backendFetch.mockReturnValue(json({ status: 'success', summary: summary(), records }));
    renderCpd();

    expect(await screen.findByText('18')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByText('May 10, 2024')).toBeInTheDocument();
    expect(screen.getByText('27')).toBeInTheDocument(); // remaining
    expect(screen.getByText('4.5')).toBeInTheDocument(); // pending

    expect(screen.getByText('ADANP Seminar')).toBeInTheDocument();
    expect(screen.getByText('Reason: Certificate unreadable')).toBeInTheDocument();
    expect(screen.getByText('Outside current cycle')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(1); // only the Pending one
  });

  it('asks for the license expiry date when there is no cycle yet', async () => {
    backendFetch.mockReturnValue(json({ status: 'success', summary: summary({ cycle: null, license: { license_number: null, expiry_date: null } }), records: [] }));
    renderCpd();

    expect(await screen.findByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profile');
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('marks the member compliant once the requirement is met', async () => {
    backendFetch.mockReturnValue(json({ status: 'success', summary: summary({ approved_units: 46, remaining_units: 0, compliant: true }), records: [] }));
    renderCpd();

    expect(await screen.findByText('COMPLIANT')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('submits a certificate with its details and reloads the records', async () => {
    const user = userEvent.setup();
    backendFetch.mockReturnValue(json({ status: 'success', summary: summary(), records: [] }));
    renderCpd();
    await screen.findByText('18');

    await user.type(screen.getByLabelText('Training title'), 'Chemical Peels 101');
    await user.type(screen.getByLabelText('Provider'), 'PDS');
    await user.type(screen.getByLabelText('Date attended'), '2025-02-01');
    await user.type(screen.getByLabelText('CPD units'), '3.5');
    const certificate = new File(['%PDF'], 'cert.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('Certificate file'), certificate);

    backendFetch.mockReturnValueOnce(json({ status: 'success', message: 'Submitted for review.' }, 201));
    await user.click(screen.getByRole('button', { name: /submit for review/i }));

    await screen.findByText(/once an admin approves them/i);
    const [path, options] = backendFetch.mock.calls.find(([p]) => p === 'submit_cpd.php');
    expect(path).toBe('submit_cpd.php');
    expect(options.method).toBe('POST');
    expect(options.body.get('title')).toBe('Chemical Peels 101');
    expect(options.body.get('units')).toBe('3.5');
    expect(options.body.get('activity_date')).toBe('2025-02-01');
    expect(options.body.get('certificate').name).toBe('cert.pdf');
    await waitFor(() => expect(backendFetch.mock.calls.filter(([p]) => p === 'get_cpd.php').length).toBe(2));
  });
});

describe('Admin CPD tab', () => {
  afterEach(() => vi.clearAllMocks());

  const pending = [{ id: 5, title: 'Laser Safety Course', provider: 'PDS', activity_date: '2025-03-01', units: 4.5, status: 'Pending', has_certificate: true, full_name: 'Ana Cruz', email: 'ana@x.ph' }];
  const members = [{ id: 7, full_name: 'Ana Cruz', email: 'ana@x.ph' }, { id: 8, full_name: 'Ben Reyes', email: 'ben@x.ph' }];

  const routeMock = (overrides = {}) => backendFetch.mockImplementation((path) => {
    if (path.startsWith('get_cpd_submissions.php')) return json({ status: 'success', records: pending });
    if (path === 'get_members.php') return json({ status: 'success', members });
    if (overrides[path]) return overrides[path]();
    return json({ status: 'success', message: 'ok' });
  });

  it('approves a pending submission', async () => {
    const user = userEvent.setup();
    routeMock();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<AdminCpd />);

    await user.click(await screen.findByRole('button', { name: 'Approve' }));

    await waitFor(() => {
      const call = backendFetch.mock.calls.find(([p]) => p === 'review_cpd.php');
      expect(JSON.parse(call[1].body)).toEqual({ id: 5, action: 'Approve', note: '' });
    });
  });

  it('requires a reason to reject', async () => {
    const user = userEvent.setup();
    routeMock();
    vi.spyOn(window, 'prompt').mockReturnValue('Certificate is not readable');
    render(<AdminCpd />);

    await user.click(await screen.findByRole('button', { name: 'Reject' }));

    await waitFor(() => {
      const call = backendFetch.mock.calls.find(([p]) => p === 'review_cpd.php');
      expect(JSON.parse(call[1].body)).toEqual({ id: 5, action: 'Reject', note: 'Certificate is not readable' });
    });
  });

  it('credits a seminar to the selected attendees', async () => {
    const user = userEvent.setup();
    routeMock({ 'create_cpd_event.php': () => json({ status: 'success', message: 'Seminar recorded and 1 member(s) credited.' }, 201) });
    render(<AdminCpd />);

    await user.type(screen.getByLabelText('Seminar title'), 'ADANP Midyear Seminar');
    await user.type(screen.getByLabelText('Date'), '2025-06-01');
    await user.type(screen.getByLabelText('Units'), '6');
    await user.click(await screen.findByRole('checkbox', { name: /Ben Reyes/ }));
    await user.click(screen.getByRole('button', { name: /record seminar/i }));

    expect(await screen.findByText('Seminar recorded and 1 member(s) credited.')).toBeInTheDocument();
    const call = backendFetch.mock.calls.find(([p]) => p === 'create_cpd_event.php');
    expect(JSON.parse(call[1].body)).toEqual({ title: 'ADANP Midyear Seminar', event_date: '2025-06-01', units: '6', member_ids: [8] });
  });
});
