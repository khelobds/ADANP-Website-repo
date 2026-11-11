import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// api.js reads its env vars at import time, so stub them and import it fresh in each test.
const loadApi = async () => {
  vi.resetModules();
  return import('./api');
};

describe('backendFetch 401 handling', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_BACKEND_ENABLED', 'true');
    vi.stubEnv('VITE_API_BASE_URL', 'http://api.test/api');
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'members' }));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('clears the cached user and notifies listeners when a protected endpoint returns 401', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 401 }));
    const { backendFetch, subscribeToUnauthorized } = await loadApi();
    const listener = vi.fn();
    subscribeToUnauthorized(listener);

    await backendFetch('get_all_applications.php');

    expect(listener).toHaveBeenCalledOnce();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('does not treat a wrong-password 401 from login.php as an expired session', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ status: 401 }));
    const { backendFetch, subscribeToUnauthorized } = await loadApi();
    const listener = vi.fn();
    subscribeToUnauthorized(listener);

    await backendFetch('login.php', { method: 'POST' });

    expect(listener).not.toHaveBeenCalled();
    expect(localStorage.getItem('user')).not.toBeNull();
  });
});
