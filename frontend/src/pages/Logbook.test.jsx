import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Logbook from './Logbook';
import AdminLogbook from './AdminLogbook';
import { backendFetch } from '../config/api';

vi.mock('../config/api', () => ({
  backendFetch: vi.fn(),
  backendErrorMessage: (error, fallback) => fallback,
}));

const json = (body, status = 200) => Promise.resolve({ ok: status < 300, status, json: async () => body });

const entries = [
  { id: 1, procedure_date: '2025-03-01', procedure_type: 'Chemical peel', treatment_area: 'Full face', patient_code: 'P-001', duration_minutes: 45, outcome: 'As expected', status: 'Verified', review_note: null },
  { id: 2, procedure_date: '2025-03-05', procedure_type: 'Dermal filler', treatment_area: null, patient_code: 'P-002', duration_minutes: null, outcome: 'Minor reaction', status: 'Pending', review_note: null },
  { id: 3, procedure_date: '2025-02-10', procedure_type: 'Laser treatment', treatment_area: null, patient_code: 'P-003', duration_minutes: 30, outcome: 'As expected', status: 'Rejected', review_note: 'Wrong date' },
];

const logbook = (overrides = {}) => ({
  status: 'success',
  entries,
  totals: { total: 3, verified: 1, pending: 1, rejected: 1, this_month: 2, verified_minutes: 90 },
  by_procedure: [{ procedure: 'Chemical peel', count: 1 }, { procedure: 'Dermal filler', count: 1 }],
  procedures: ['Botulinum toxin injection', 'Chemical peel', 'Dermal filler', 'Laser treatment'],
  outcomes: ['As expected', 'Minor reaction', 'Complication'],
  ...overrides,
});

// Answers GETs with the logbook and POSTs with postResponse
const mockServer = (postResponse = json({ status: 'success', message: 'Entry added.' })) => {
  backendFetch.mockImplementation((path, options) => (options?.method === 'POST' ? postResponse : json(logbook())));
};

const postsTo = (path) => backendFetch.mock.calls.filter(([p, o]) => p === path && o?.method === 'POST');

const renderLogbook = () => render(<MemoryRouter><Logbook /></MemoryRouter>);

describe('Logbook page', () => {
  beforeEach(() => localStorage.setItem('user', JSON.stringify({ id: 7, role: 'members', full_name: 'Ana Cruz' })));
  afterEach(() => { vi.clearAllMocks(); vi.restoreAllMocks(); localStorage.clear(); });

  it('shows the totals, procedure counts and entries from the server', async () => {
    mockServer();
    renderLogbook();

    expect(await screen.findByText('P-001')).toBeInTheDocument();
    expect(screen.getByTestId('stat-total')).toHaveTextContent('3');
    expect(screen.getByTestId('stat-hours')).toHaveTextContent('1.5h');
    expect(screen.getByTestId('stat-month')).toHaveTextContent('+2');
    expect(screen.getByTestId('stat-pending')).toHaveTextContent('1');

    expect(screen.getByText('Full face')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(screen.getByText('Reason: Wrong date')).toBeInTheDocument();
    expect(screen.getByText(/signed off/i)).toBeInTheDocument();
    // Pending and Rejected entries can be deleted, the Verified one cannot
    expect(screen.getAllByRole('button', { name: /delete/i })).toHaveLength(2);
    expect(backendFetch).toHaveBeenCalledWith('get_logbook.php');
  });

  it('shows an empty state when there are no entries', async () => {
    backendFetch.mockReturnValue(json(logbook({ entries: [], by_procedure: [], totals: { total: 0, verified: 0, pending: 0, rejected: 0, this_month: 0, verified_minutes: 0 } })));
    renderLogbook();

    expect(await screen.findByText(/no entries yet/i)).toBeInTheDocument();
    expect(screen.getByText(/no procedures logged yet/i)).toBeInTheDocument();
  });

  it('adds an entry with the procedure and outcome chosen from the server lists', async () => {
    const user = userEvent.setup();
    mockServer();
    renderLogbook();
    await screen.findByText('P-001');

    await user.click(screen.getByRole('button', { name: /new entry/i }));
    const form = screen.getByRole('form', { name: /new logbook entry/i });
    await user.type(within(form).getByLabelText(/procedure date/i), '2025-03-10');
    await user.selectOptions(within(form).getByLabelText(/^procedure$/i), 'Dermal filler');
    await user.type(within(form).getByLabelText(/area treated/i), 'Lips');
    await user.type(within(form).getByLabelText(/patient code/i), 'P-0042');
    await user.type(within(form).getByLabelText(/duration/i), '20');
    await user.selectOptions(within(form).getByLabelText(/outcome/i), 'As expected');
    await user.click(within(form).getByRole('button', { name: /add entry/i }));

    expect(await screen.findByText('Entry added.')).toBeInTheDocument();
    const [[, options]] = postsTo('submit_logbook.php');
    expect(JSON.parse(options.body)).toEqual({
      procedure_date: '2025-03-10',
      procedure_type: 'Dermal filler',
      treatment_area: 'Lips',
      patient_code: 'P-0042',
      duration_minutes: '20',
      outcome: 'As expected',
    });
    expect(screen.queryByRole('form', { name: /new logbook entry/i })).not.toBeInTheDocument();
    expect(backendFetch.mock.calls.filter(([p]) => p === 'get_logbook.php')).toHaveLength(2); // reloaded
  });

  it('keeps the form open and shows the server error when an entry is refused', async () => {
    const user = userEvent.setup();
    mockServer(json({ status: 'error', message: 'The procedure date cannot be in the future.' }, 400));
    renderLogbook();
    await screen.findByText('P-001');

    await user.click(screen.getByRole('button', { name: /new entry/i }));
    const form = screen.getByRole('form', { name: /new logbook entry/i });
    await user.type(within(form).getByLabelText(/procedure date/i), '2025-03-10');
    await user.selectOptions(within(form).getByLabelText(/^procedure$/i), 'Chemical peel');
    await user.type(within(form).getByLabelText(/patient code/i), 'P-7');
    await user.selectOptions(within(form).getByLabelText(/outcome/i), 'Complication');
    await user.click(within(form).getByRole('button', { name: /add entry/i }));

    expect(await screen.findByText('The procedure date cannot be in the future.')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: /new logbook entry/i })).toBeInTheDocument();
  });

  it('deletes an entry after confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockServer(json({ status: 'success', message: 'Entry deleted.' }));
    renderLogbook();
    await screen.findByText('P-001');

    const row = screen.getByText('P-002').closest('tr');
    await user.click(within(row).getByRole('button', { name: /delete/i }));

    await waitFor(() => expect(postsTo('delete_logbook.php')).toHaveLength(1));
    expect(JSON.parse(postsTo('delete_logbook.php')[0][1].body)).toEqual({ id: 2 });
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    mockServer();
    renderLogbook();
    await screen.findByText('P-001');

    await user.click(within(screen.getByText('P-002').closest('tr')).getByRole('button', { name: /delete/i }));
    expect(postsTo('delete_logbook.php')).toHaveLength(0);
  });
});

describe('Admin logbook tab', () => {
  afterEach(() => { vi.clearAllMocks(); vi.restoreAllMocks(); });

  const pending = [
    { id: 2, member_id: 7, full_name: 'Ana Cruz', email: 'ana@example.com', procedure_date: '2025-03-05', procedure_type: 'Dermal filler', treatment_area: 'Lips', patient_code: 'P-002', duration_minutes: 20, outcome: 'As expected', status: 'Pending', review_note: null },
  ];

  const mockAdmin = () => backendFetch.mockImplementation((path, options) => (
    options?.method === 'POST' ? json({ status: 'success', message: 'Done.' }) : json({ status: 'success', entries: pending })
  ));

  it('lists pending entries and verifies one', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockAdmin();
    render(<AdminLogbook />);

    expect(await screen.findByText('Ana Cruz')).toBeInTheDocument();
    expect(backendFetch).toHaveBeenCalledWith('get_logbook_submissions.php?status=Pending');
    await user.click(screen.getByRole('button', { name: 'Verify' }));

    await waitFor(() => expect(postsTo('review_logbook.php')).toHaveLength(1));
    expect(JSON.parse(postsTo('review_logbook.php')[0][1].body)).toEqual({ id: 2, action: 'Verify', note: '' });
  });

  it('requires a reason to reject', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    const prompt = vi.spyOn(window, 'prompt').mockReturnValueOnce('   ').mockReturnValueOnce('Patient code looks like a name');
    mockAdmin();
    render(<AdminLogbook />);
    await screen.findByText('Ana Cruz');

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    expect(window.alert).toHaveBeenCalledWith('A reason is required to reject an entry.');
    expect(postsTo('review_logbook.php')).toHaveLength(0);

    await user.click(screen.getByRole('button', { name: 'Reject' }));
    await waitFor(() => expect(postsTo('review_logbook.php')).toHaveLength(1));
    expect(JSON.parse(postsTo('review_logbook.php')[0][1].body)).toEqual({ id: 2, action: 'Reject', note: 'Patient code looks like a name' });
    expect(prompt).toHaveBeenCalledTimes(2);
  });

  it('switches to the verified list', async () => {
    const user = userEvent.setup();
    mockAdmin();
    render(<AdminLogbook />);
    await screen.findByText('Ana Cruz');

    await user.click(screen.getByRole('tab', { name: 'Verified' }));
    await waitFor(() => expect(backendFetch).toHaveBeenCalledWith('get_logbook_submissions.php?status=Verified'));
  });
});
