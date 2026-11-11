import { backendFetch, isBackendEnabled } from './api';

// Where each role lands after login, and where a logged-in user is sent when they open another role's page.
// Roles are the backend table names returned by login.php and me.php.
export const ROLE_HOME = {
  admin_user: '/admin-dashboard',
  members: '/member-dashboard',
  non_members: '/non-member-dashboard',
};

// Stand-in users for previewing protected pages while the backend is off. The backend never sees these.
export const DEMO_USERS = {
  admin_user: { id: 0, email: 'admin@preview.local', role: 'admin_user', full_name: 'Preview Admin' },
  members: { id: 0, email: 'member@preview.local', role: 'members', full_name: 'Preview Member' },
  non_members: { id: 0, email: 'applicant@preview.local', role: 'non_members', full_name: 'Preview Applicant' },
};

// localStorage['user'] is a display-only cache; the backend session decides access.
export const getCachedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

export const setCachedUser = (user) => localStorage.setItem('user', JSON.stringify(user));

// Asks the server who is logged in. Resolves to { id, email, role }, or null if nobody is.
export const fetchSessionUser = async () => {
  const response = await backendFetch('me.php');
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(`me.php returned ${response.status}`);
  const data = await response.json();
  return data.user ?? null;
};

// Keeps extra profile fields cached at login (e.g. full_name) when the session is still the same account.
export const syncCachedUser = (sessionUser) => {
  const cached = getCachedUser();
  if (cached?.id === sessionUser.id && cached?.role === sessionUser.role) return;
  setCachedUser(sessionUser);
};

// Backend off (preview): make sure a demo user with an allowed role is cached so the page can render.
export const ensureDemoUser = (roles) => {
  if (isBackendEnabled()) return;
  if (!roles.includes(getCachedUser()?.role)) setCachedUser(DEMO_USERS[roles[0]]);
};
