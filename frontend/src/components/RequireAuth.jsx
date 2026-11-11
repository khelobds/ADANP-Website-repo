import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isBackendEnabled } from '../config/api';
import { ROLE_HOME, ensureDemoUser, fetchSessionUser, syncCachedUser } from '../config/auth';

// Route guard for member-area and admin pages.
// Backend on: asks me.php for the session user; no session → /login, wrong role → that role's own dashboard.
// Backend off (preview): lets everyone in, caching a demo user so the page has someone to display.
// This only routes people; the backend still enforces access on every endpoint.
const RequireAuth = ({ roles, children }) => {
  const { pathname } = useLocation();
  const backendEnabled = isBackendEnabled();
  const [result, setResult] = useState({ pathname: null, redirect: null });
  const rolesKey = roles.join(',');

  useEffect(() => {
    if (!backendEnabled) return undefined;
    let cancelled = false;
    const allowed = rolesKey.split(',');

    fetchSessionUser()
      .then((user) => {
        if (cancelled) return;
        if (!user) {
          localStorage.removeItem('user');
          setResult({ pathname, redirect: '/login' });
          return;
        }
        syncCachedUser(user);
        setResult({ pathname, redirect: allowed.includes(user.role) ? null : ROLE_HOME[user.role] || '/' });
      })
      .catch((error) => {
        console.error('Session check failed:', error);
        if (!cancelled) setResult({ pathname, redirect: '/login' });
      });

    return () => { cancelled = true; };
  }, [backendEnabled, pathname, rolesKey]);

  if (!backendEnabled) {
    ensureDemoUser(roles);
    return children;
  }

  if (result.pathname !== pathname) return null; // still checking this page
  if (result.redirect) return <Navigate to={result.redirect} replace />;
  return children;
};

export default RequireAuth;
