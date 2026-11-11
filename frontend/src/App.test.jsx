import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

// Smoke test: every route must render something. Importing App loads every page module,
// so a page that throws while loading or rendering (which shows a blank white screen in
// the browser and still builds fine) fails here instead.
//
// The backend is forced off (a developer's .env.local may turn it on), so protected pages
// render with a demo user and API calls fail fast instead of reaching a real server.
vi.mock('./config/api', async (importOriginal) => {
  const actual = await importOriginal();
  const unavailable = () => Promise.reject(Object.assign(new Error('Backend off in tests'), { code: 'BACKEND_UNAVAILABLE' }));
  return { ...actual, isBackendEnabled: () => false, backendFetch: vi.fn(unavailable) };
});
const ROUTES = [
  '/', '/about', '/board', '/certification', '/membership', '/education', '/policy', '/news',
  '/gallery', '/work-with-us', '/contact', '/login', '/legal', '/career', '/achievements',
  '/member-dashboard', '/profile', '/cpd', '/library', '/videos', '/logbook', '/forum',
  '/non-member-dashboard', '/admin-dashboard', '/gallery-admin',
];

describe('every page renders', () => {
  afterEach(() => localStorage.clear());

  it.each(ROUTES)('%s', (path) => {
    window.history.pushState({}, '', path);
    const { container } = render(<App />);
    expect(container.querySelector('main').textContent.trim()).not.toBe('');
  });

  it('shows the home page content at /', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getAllByText(/ADANP/i).length).toBeGreaterThan(0);
  });
});
