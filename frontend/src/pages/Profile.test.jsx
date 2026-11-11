import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Profile from './Profile';
import { backendFetch } from '../config/api';
import { loadPrivateFile } from '../components/FileViewerModal';

vi.mock('../config/api', () => ({
  backendFetch: vi.fn(),
  backendErrorMessage: (error, fallback) => fallback,
  isBackendEnabled: () => true,
}));

vi.mock('../components/FileViewerModal', () => ({
  loadPrivateFile: vi.fn(),
}));

const json = (body, status = 200) => Promise.resolve({ ok: status < 300, status, json: async () => body });

const profile = (overrides = {}) => ({
  full_name: 'Ana Cruz',
  email: 'ana@example.com',
  member_number: 'ADANP-2026-0007',
  member_since: '2026',
  current_workplace: 'Skin Clinic QC',
  professional_bio: 'Ten years in aesthetic nursing.',
  has_photo: false,
  privacy: { privacy_visibility: true, privacy_show_bio: false, privacy_show_workplace: true, privacy_show_email: false },
  ...overrides,
});

const license = { license_number: '0123456', expiry_date: '2027-05-10' };

// Answers each endpoint; pass overrides as { 'METHOD path': response }
const mockServer = (overrides = {}) => {
  backendFetch.mockImplementation((path, options) => {
    const key = `${options?.method || 'GET'} ${path}`;
    if (overrides[key]) return overrides[key]();
    if (key === 'GET profile.php') return json({ status: 'success', profile: profile() });
    if (key === 'POST profile.php') return json({ status: 'success', message: 'Profile saved.', profile: profile(JSON.parse(options.body)) });
    if (key === 'GET license.php') return json({ status: 'success', license });
    if (key === 'POST license.php') return json({ status: 'success', license });
    if (key === 'POST profile_photo.php') return json({ status: 'success', message: 'Photo updated.' });
    if (key === 'DELETE profile_photo.php') return json({ status: 'success', message: 'Photo removed.' });
    return json({ status: 'error', message: `unexpected ${key}` }, 500);
  });
};

const callsTo = (method, path) => backendFetch.mock.calls.filter(([p, o]) => p === path && (o?.method || 'GET') === method);
const renderProfile = () => render(<MemoryRouter><Profile /></MemoryRouter>);

describe('Profile page', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 7, role: 'members', email: 'ana@example.com' }));
    loadPrivateFile.mockResolvedValue({ url: 'blob:photo', type: 'image/png' });
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => { vi.clearAllMocks(); vi.restoreAllMocks(); localStorage.clear(); });

  it('shows the profile, membership ID and license from the server', async () => {
    mockServer();
    renderProfile();

    expect(await screen.findByText('ADANP-2026-0007')).toBeInTheDocument();
    expect(screen.getByText('MEMBER SINCE 2026')).toBeInTheDocument();
    expect(screen.queryByText(/valid thru/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toHaveValue('Ana Cruz');
    expect(screen.getByLabelText('Full Name')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Email')).toHaveAttribute('readonly');
    expect(screen.getByLabelText('Current Workplace')).toHaveValue('Skin Clinic QC');
    expect(screen.getByLabelText('Professional Background')).toHaveValue('Ten years in aesthetic nursing.');
    expect(screen.getByLabelText('Show Professional Bio')).not.toBeChecked();
    expect(screen.getByLabelText('Show Workplace')).toBeChecked();
    expect(await screen.findByDisplayValue('0123456')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2027-05-10')).toBeInTheDocument();

    // No photo yet: placeholder, and the photo is not requested
    expect(screen.queryByAltText('Member')).not.toBeInTheDocument();
    expect(loadPrivateFile).not.toHaveBeenCalled();
  });

  it('stores the server name in the cached user so other pages greet the member', async () => {
    mockServer();
    renderProfile();
    await screen.findByText('ADANP-2026-0007');

    expect(JSON.parse(localStorage.getItem('user'))).toMatchObject({ id: 7, full_name: 'Ana Cruz' });
  });

  it('loads the private photo when the member has one', async () => {
    mockServer({ 'GET profile.php': () => json({ status: 'success', profile: profile({ has_photo: true }) }) });
    renderProfile();

    expect(await screen.findByAltText('Member')).toHaveAttribute('src', 'blob:photo');
    expect(loadPrivateFile).toHaveBeenCalledWith('profile_photo.php');
  });

  it('saves the profile without the name or email, then the license', async () => {
    const user = userEvent.setup();
    mockServer();
    renderProfile();
    await screen.findByText('ADANP-2026-0007');
    await screen.findByDisplayValue('0123456');

    await user.clear(screen.getByLabelText('Current Workplace'));
    await user.type(screen.getByLabelText('Current Workplace'), 'Derma Center');
    await user.click(screen.getByLabelText('Display Email'));
    await user.click(screen.getByRole('button', { name: /save all changes/i }));

    expect(await screen.findByText('Profile saved.')).toBeInTheDocument();
    expect(JSON.parse(callsTo('POST', 'profile.php')[0][1].body)).toEqual({
      current_workplace: 'Derma Center',
      professional_bio: 'Ten years in aesthetic nursing.',
      privacy_visibility: true,
      privacy_show_bio: false,
      privacy_show_workplace: true,
      privacy_show_email: true,
    });
    expect(JSON.parse(callsTo('POST', 'license.php')[0][1].body)).toEqual({ license_number: '0123456', expiry_date: '2027-05-10' });
  });

  it('does not save the license when the profile is refused', async () => {
    const user = userEvent.setup();
    mockServer({ 'POST profile.php': () => json({ status: 'error', message: 'Workplace can be at most 255 characters.' }, 400) });
    renderProfile();
    await screen.findByText('ADANP-2026-0007');

    await user.click(screen.getByRole('button', { name: /save all changes/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Your profile was not saved: Workplace can be at most 255 characters.');
    expect(callsTo('POST', 'license.php')).toHaveLength(0);
  });

  it('says so when the profile saved but the license did not', async () => {
    const user = userEvent.setup();
    mockServer({ 'POST license.php': () => json({ status: 'error', message: 'Enter a valid expiry date.' }, 400) });
    renderProfile();
    await screen.findByText('ADANP-2026-0007');

    await user.click(screen.getByRole('button', { name: /save all changes/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Your profile was saved, but the PRC license was not: Enter a valid expiry date.');
  });

  it('uploads a photo and shows it', async () => {
    const user = userEvent.setup();
    mockServer();
    renderProfile();
    await screen.findByText('ADANP-2026-0007');

    const photo = new File(['png'], 'me.png', { type: 'image/png' });
    await user.upload(screen.getByLabelText('Profile photo'), photo);

    expect(await screen.findByText('Photo updated.')).toBeInTheDocument();
    const [[, options]] = callsTo('POST', 'profile_photo.php');
    expect(options.body.get('photo')).toBe(photo);
    expect(screen.getByAltText('Member')).toHaveAttribute('src', 'blob:photo');
    expect(screen.getByRole('button', { name: /change photo/i })).toBeInTheDocument();
  });

  it('refuses photos that are too large or not JPG/PNG before uploading', async () => {
    const user = userEvent.setup({ applyAccept: false });
    mockServer();
    renderProfile();
    await screen.findByText('ADANP-2026-0007');

    await user.upload(screen.getByLabelText('Profile photo'), new File(['gif'], 'me.gif', { type: 'image/gif' }));
    expect(await screen.findByText('Choose a JPG or PNG photo.')).toBeInTheDocument();

    const big = new File([new Uint8Array(2 * 1024 * 1024 + 1)], 'big.jpg', { type: 'image/jpeg' });
    await user.upload(screen.getByLabelText('Profile photo'), big);
    expect(await screen.findByText('The photo is too large. Maximum size is 2 MB.')).toBeInTheDocument();

    expect(callsTo('POST', 'profile_photo.php')).toHaveLength(0);
  });

  it('removes the photo after confirmation', async () => {
    const user = userEvent.setup();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    mockServer({ 'GET profile.php': () => json({ status: 'success', profile: profile({ has_photo: true }) }) });
    renderProfile();
    await screen.findByAltText('Member');

    await user.click(screen.getByRole('button', { name: /remove photo/i }));

    expect(await screen.findByText('Photo removed.')).toBeInTheDocument();
    expect(callsTo('DELETE', 'profile_photo.php')).toHaveLength(1);
    expect(screen.queryByAltText('Member')).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:photo');
  });

  it('shows an error when the profile cannot be loaded', async () => {
    mockServer({ 'GET profile.php': () => Promise.reject(new Error('network down')) });
    renderProfile();

    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load your profile.');
    expect(screen.getByRole('button', { name: /save all changes/i })).toBeInTheDocument();
  });
});
