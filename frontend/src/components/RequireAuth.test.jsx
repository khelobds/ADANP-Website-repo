import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import RequireAuth from './RequireAuth';
import { backendFetch, isBackendEnabled } from '../config/api';

vi.mock('../config/api', () => ({
  isBackendEnabled: vi.fn(),
  backendFetch: vi.fn(),
}));

const jsonResponse = (status, body) => ({ status, ok: status >= 200 && status < 300, json: async () => body });

const renderAt = (path) => render(
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/login" element={<p>login page</p>} />
      <Route path="/member-dashboard" element={<RequireAuth roles={['members']}><p>member page</p></RequireAuth>} />
      <Route path="/admin-dashboard" element={<RequireAuth roles={['admin_user']}><p>admin page</p></RequireAuth>} />
    </Routes>
  </MemoryRouter>,
);

describe('RequireAuth', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.clearAllMocks());

  describe('backend on', () => {
    beforeEach(() => isBackendEnabled.mockReturnValue(true));

    it('sends visitors with no session to /login and clears the cached user', async () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, role: 'members' }));
      backendFetch.mockResolvedValue(jsonResponse(401, { status: 'error' }));

      renderAt('/member-dashboard');

      expect(await screen.findByText('login page')).toBeInTheDocument();
      expect(localStorage.getItem('user')).toBeNull();
      expect(backendFetch).toHaveBeenCalledWith('me.php');
    });

    it('renders the page when the session role is allowed, keeping cached profile fields', async () => {
      localStorage.setItem('user', JSON.stringify({ id: 7, role: 'members', full_name: 'Ana' }));
      backendFetch.mockResolvedValue(jsonResponse(200, { status: 'success', user: { id: 7, email: 'a@x.ph', role: 'members' } }));

      renderAt('/member-dashboard');

      expect(await screen.findByText('member page')).toBeInTheDocument();
      expect(JSON.parse(localStorage.getItem('user')).full_name).toBe('Ana');
    });

    it('sends a logged-in user with the wrong role to their own dashboard', async () => {
      backendFetch.mockResolvedValue(jsonResponse(200, { status: 'success', user: { id: 7, email: 'a@x.ph', role: 'members' } }));

      renderAt('/admin-dashboard');

      expect(await screen.findByText('member page')).toBeInTheDocument();
      expect(screen.queryByText('admin page')).not.toBeInTheDocument();
    });

    it('ignores a faked localStorage user when the server has no session', async () => {
      localStorage.setItem('user', JSON.stringify({ id: 1, role: 'admin_user' }));
      backendFetch.mockResolvedValue(jsonResponse(401, { status: 'error' }));

      renderAt('/admin-dashboard');

      expect(await screen.findByText('login page')).toBeInTheDocument();
    });
  });

  describe('backend off (preview)', () => {
    beforeEach(() => isBackendEnabled.mockReturnValue(false));

    it('opens protected pages without a login and caches a demo user with the page role', () => {
      renderAt('/admin-dashboard');

      expect(screen.getByText('admin page')).toBeInTheDocument();
      expect(JSON.parse(localStorage.getItem('user')).role).toBe('admin_user');
      expect(backendFetch).not.toHaveBeenCalled();
    });
  });
});
