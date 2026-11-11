export const BACKEND_UNAVAILABLE_MESSAGE = 'Backend services are temporarily unavailable while integration is under development. Please try again later.';

let unavailableMessage = '';
const noticeListeners = new Set();

const backendEnabled = import.meta.env.VITE_BACKEND_ENABLED === 'true'; 
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim(); 
const localApiBaseUrl = import.meta.env.DEV ? 'http://localhost:8000/api' : '';
const apiBaseUrl = (configuredApiBaseUrl || localApiBaseUrl).replace(/\/+$/, '');
export const API_BASE_URL = apiBaseUrl;

export const isBackendEnabled = () => backendEnabled;

// Notified when an API call returns 401 (session missing or expired); App.jsx sends the user to /login.
const unauthorizedListeners = new Set();

export const subscribeToUnauthorized = (listener) => {
  unauthorizedListeners.add(listener);
  return () => unauthorizedListeners.delete(listener);
};

// login.php answers 401 for a wrong password, and me.php's 401 is handled by RequireAuth, so neither counts.
const SESSION_CHECK_EXEMPT = new Set(['login.php', 'me.php']);

const handleUnauthorized = (path, response) => {
  const endpoint = path.replace(/^\/+/, '').split('?')[0];
  if (response.status === 401 && !SESSION_CHECK_EXEMPT.has(endpoint)) {
    localStorage.removeItem('user');
    unauthorizedListeners.forEach((listener) => listener());
  }
  return response;
};

const notifyUnavailable = (message = BACKEND_UNAVAILABLE_MESSAGE) => {
  unavailableMessage = message;
  noticeListeners.forEach((listener) => listener());
};

export const subscribeToBackendNotice = (listener) => {
  noticeListeners.add(listener);
  return () => noticeListeners.delete(listener);
};

export const getBackendNotice = () => unavailableMessage;

export const clearBackendNotice = () => {
  unavailableMessage = '';
  noticeListeners.forEach((listener) => listener());
};

export const backendErrorMessage = (error, fallbackMessage) => (
  error?.code === 'BACKEND_UNAVAILABLE' || error?.code === 'BACKEND_NOT_CONFIGURED'
    ? error.message
    : fallbackMessage
);

export const backendFetch = (path, options) => {
  if (!backendEnabled) {
    notifyUnavailable();
    return Promise.reject(Object.assign(new Error(BACKEND_UNAVAILABLE_MESSAGE), { code: 'BACKEND_UNAVAILABLE' }));
  }

  if (!apiBaseUrl) {
    const message = 'Backend API URL is not configured.';
    notifyUnavailable(message);
    return Promise.reject(Object.assign(new Error(message), { code: 'BACKEND_NOT_CONFIGURED' }));
  }

  // credentials: send the PHP session cookie so the backend knows who is logged in.
  // X-Requested-With: the backend rejects data-changing requests without it (CSRF protection).
  return fetch(`${apiBaseUrl}/${path.replace(/^\/+/, '')}`, {
    ...options,
    credentials: 'include',
    headers: { 'X-Requested-With': 'XMLHttpRequest', ...options?.headers },
  }).then((response) => handleUnauthorized(path, response));
};

// Ends the server session, then clears the cached user. The cache is cleared even if the request fails.
export const logout = async () => {
  try {
    await backendFetch('logout.php', { method: 'POST' });
  } catch (error) {
    console.error('Logout error:', error);
  }
  localStorage.removeItem('user');
};

export const uploadedFileUrl = (path) => {
  if (!backendEnabled || !apiBaseUrl || !path) return '';

  return `${apiBaseUrl}/${path.replace(/^\/+/, '')}`;
};

// Proof-of-payment files are private: load them with backendFetch(`proof.php?id=<application id>`).