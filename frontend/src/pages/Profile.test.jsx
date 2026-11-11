import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Profile from './Profile';
import { backendFetch } from '../config/api';

vi.mock('../config/api', () => ({
  backendFetch: vi.fn(),
  backendErrorMessage: (error, fallback) => fallback,
}));

const json = (body, status = 200) => Promise.resolve({ ok: status < 300, status, json: async () => body });

describe('Profile PRC license', () => {
  beforeEach(() => localStorage.setItem('user', JSON.stringify({ id: 7, role: 'members', full_name: 'Ana Cruz' })));
  afterEach(() => { vi.clearAllMocks(); vi.restoreAllMocks(); localStorage.clear(); });

  it('loads the saved license from the server', async () => {
    backendFetch.mockReturnValue(json({ status: 'success', license: { license_number: '0123456', expiry_date: '2027-05-10' } }));
    render(<MemoryRouter><Profile /></MemoryRouter>);

    expect(await screen.findByDisplayValue('0123456')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2027-05-10')).toBeInTheDocument();
    expect(backendFetch).toHaveBeenCalledWith('license.php');
  });

  it('saves the license number and expiry date to license.php', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    backendFetch.mockReturnValue(json({ status: 'success', license: { license_number: null, expiry_date: null } }));
    render(<MemoryRouter><Profile /></MemoryRouter>);
    await waitFor(() => expect(backendFetch).toHaveBeenCalled());

    await user.type(screen.getByPlaceholderText('0000000'), '7654321');
    await user.click(screen.getByRole('button', { name: /save all changes/i }));

    await waitFor(() => expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!'));
    const [, options] = backendFetch.mock.calls.find(([path, opts]) => path === 'license.php' && opts?.method === 'POST');
    expect(JSON.parse(options.body)).toEqual({ license_number: '7654321', expiry_date: '' });
  });
});
