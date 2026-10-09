export const BACKEND_UNAVAILABLE_MESSAGE = 'Backend services are temporarily unavailable while integration is under development. Please try again later.';

let unavailableMessage = '';
const noticeListeners = new Set();

const backendEnabled = import.meta.env.VITE_BACKEND_ENABLED === 'true'; 
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim(); 
const localApiBaseUrl = import.meta.env.DEV ? 'http://localhost:8000/api' : '';
const apiBaseUrl = (configuredApiBaseUrl || localApiBaseUrl).replace(/\/+$/, '');

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

  return fetch(`${apiBaseUrl}/${path.replace(/^\/+/, '')}`, options);
};

export const uploadedFileUrl = (path) => {
  if (!backendEnabled || !apiBaseUrl || !path) return '';

  return `${apiBaseUrl}/${path.replace(/^\/+/, '')}`;
};

export const uploadedProofUrl = (path) => {
  if (!backendEnabled || !apiBaseUrl || !path) return '';

  return `${new URL(apiBaseUrl).origin}/${path.replace(/^\/+/, '')}`;
};