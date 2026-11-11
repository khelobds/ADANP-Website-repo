# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

ADANP Web Platform: a React (Vite) SPA in `frontend/` talking to plain PHP endpoint scripts in `backend/` backed by MySQL (`adanp_portal`). There is no root-level app; the root `package-lock.json`/`node_modules` are stray — run npm commands inside `frontend/`.

## Commands

Frontend (run from `frontend/`):

```bash
npm install
npm run dev            # Vite dev server at http://localhost:5173
npm run build
npm test               # vitest in watch mode
npm run test:run       # vitest single run
npx vitest run src/components/components.test.jsx -t "submits contact form"   # single test
npm run verify         # test:run + build — this is exactly what CI runs
```

CI (`.github/workflows/ci.yml`) runs only `npm ci && npm run verify` in `frontend/` on Node 20. There is no linter configured and no PHP tests in CI.

Backend (run from repo root):

```bash
php -S localhost:8000 -t backend/public    # API served at http://localhost:8000/api
php backend/bin/migrate.php                # applies backend/database/schema.sql (CLI-only)
php backend/bin/rehash_passwords.php       # lists plain-text passwords; add --apply to hash them (login only accepts hashes)
php backend/tests/connection_cli.php       # DB connectivity diagnostic (tests/ are diagnostics, not a test suite)
```

DB credentials come from process env vars `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_CHARSET`; CORS and session settings from `CORS_ALLOWED_ORIGINS` and `SESSION_*` (see `backend/.env.example`). PHP does **not** load `.env` files; defaults are `localhost` / `adanp_portal` / `root` / empty password (XAMPP/WAMP).

## Architecture

### Frontend ↔ backend gate

All API calls must go through `backendFetch()` in `frontend/src/config/api.js`, never raw `fetch`. The backend is **disabled by default**: unless `VITE_BACKEND_ENABLED=true`, `backendFetch` rejects with `code: 'BACKEND_UNAVAILABLE'` and publishes a notice that `App.jsx` renders as a dismissible banner (via `useSyncExternalStore` on `subscribeToBackendNotice`/`getBackendNotice`). Use `backendErrorMessage(error, fallback)` to surface these errors. The API base URL is `VITE_API_BASE_URL`, falling back to `http://localhost:8000/api` only in dev; in production builds with no URL configured, calls fail with `BACKEND_NOT_CONFIGURED`.

Two upload locations, two URL helpers:
- Gallery media → `backend/public/api/uploads/`, resolved with `uploadedFileUrl(path)` (relative to the API base).
- Membership proof-of-payment → `backend/public/uploads/`, resolved with `uploadedProofUrl(path)` (relative to the API origin).

### Routing and layout

All routes are declared flat in `frontend/src/App.jsx`. Layout chrome is decided there by pathname: the public `Navbar` is hidden on gallery-admin and on "dashboard" pages, which are detected by a hardcoded list of paths (`/profile`, `/cpd`, `/library`, `/videos`, `/logbook`, `/legal`, `/career`, `/forum`, `/achievements`, plus anything containing `dashboard`). Adding a new member-area page requires adding its path to that `isDashboardPage` check; those pages render their own `Sidebar` instead.

Each page has a co-located `.css` file (vanilla CSS, no CSS framework); global styles are in `src/styles/index.css`.

### Auth model

PHP sessions (cookie `ADANPSESSID`, HttpOnly) via `backend/config/Auth.php`. `login.php` searches `admin_user`, `members`, then `non_members` for the email, stores `{ id, email, role }` in the session with `loginUser()` and also returns it; `role` is the **table name**. Protected endpoints call `requireLogin()` or `requireLogin(array('admin_user'))`, which returns the session user or exits with 401/403, and must take the user ID from that return value, never from the request. `requireLogin()` also rejects non-GET requests without the `X-Requested-With: XMLHttpRequest` header (CSRF protection). `backendFetch()` sends that header and `credentials: 'include'` on every call. `logout.php` ends the session (frontend: `logout()` in `api.js`); `me.php` returns the session user. Session cookie settings come from `SESSION_SAMESITE`, `SESSION_SECURE`, `SESSION_IDLE_TIMEOUT` (see `backend/.env.example`).

Protected routes are wrapped in `<RequireAuth roles={...}>` (`frontend/src/components/RequireAuth.jsx`) in `App.jsx`; add new member-area or admin pages there too. With the backend on, it asks `me.php` for the session user: no session → `/login`, wrong role → that role's dashboard (`ROLE_HOME` in `frontend/src/config/auth.js`). With the backend off it lets everyone in and caches a demo user with the page's role, so the UI can be previewed. Any other endpoint returning 401 (except `login.php`) clears the cache and `App.jsx` navigates to `/login` (`subscribeToUnauthorized` in `api.js`). `/legal`, `/career` and `/achievements` use the dashboard layout but are public.

The frontend caches the user in `localStorage['user']`; pages read it for display only. The backend decides access.

Membership flow: a user registers as a `non_members` row → submits a `non_member_applications` row (multipart form with proof upload) via `NonMemberDashboard` → an admin approves/rejects it in `AdminDashboard` via `update_application.php`, which copies an approved user into `members`. The next `get_application_status.php` call switches that user's session to the `members` account and returns it as `user`.

### Backend endpoints

`backend/public` is the web document root so `config/`, `database/`, `bin/`, `tests/` stay non-public. Each file in `backend/public/api/` is a standalone endpoint following the same template: `require_once __DIR__ . '/../../config/Cors.php'` + `applyCors('POST, OPTIONS')` (sets headers for origins in `CORS_ALLOWED_ORIGINS` and short-circuits OPTIONS), then for protected endpoints `require_once __DIR__ . '/../../config/Auth.php'` + `requireLogin(...)`, then `require_once __DIR__ . '/../../config/Database.php'`, `(new Database())->getConnection()` (returns `null` on failure, so check it), then PDO prepared statements and a JSON response with `status`/`message`. Copy this structure when adding endpoints.

Schema lives in `backend/database/schema.sql` (`CREATE TABLE IF NOT EXISTS`); `migrate.php` naively splits it on `;`, so avoid semicolons inside statements there.
