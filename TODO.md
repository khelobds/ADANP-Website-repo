# ADANP Web Platform — TODO

Unfinished features and tasks, grouped by priority. Last reviewed: 2026-11-06.

## 1. Security (fix before going live)

- [x] **Stop uploads from running as code.** Done 2026-11-06 and tested on XAMPP. `upload.php` and `submit_application.php` now detect the real type with `finfo`, take the saved extension from an allowlist for that type, and use random file names. `.htaccess` in `api/uploads/` and `uploads/` serves only media/PDF files and never runs PHP.
  - [ ] If production runs on Nginx (or anything other than Apache), add the same "no scripts, media only" rule to the server config, since `.htaccess` is ignored there.
  - [ ] Try a photo, a video and a proof-of-payment upload through the website UI (only tested directly against the endpoints so far).
- [x] **Add server-side sessions.** Done 2026-11-06 and tested against the endpoints. PHP sessions via `backend/config/Auth.php` (HttpOnly cookie, strict mode, new session ID on login, idle timeout). `submit_application.php` and `get_application_status.php` take the user from the session instead of the request. CSRF protection: non-GET requests must carry `X-Requested-With`.
  - [ ] Test log in, log out, application submit/approve and gallery edits through the website UI in a browser (only tested with direct requests so far).
- [x] **Require an admin login on admin endpoints:** `delete.php`, `update_application.php`, `get_all_applications.php`, `upload.php` now call `requireLogin(array('admin_user'))`.
- [ ] **Protect frontend routes.** Add route guards in `frontend/src/App.jsx` for `/admin-dashboard`, `/gallery-admin`, `/member-dashboard`, `/non-member-dashboard`, `/profile`, `/cpd`, `/library`, `/videos`, `/logbook` and `/forum`. Right now anyone can open them by typing the URL (the backend now refuses their data, but the pages still render). Use `me.php` to check the session, and send the user to `/login` when an API call returns 401.
- [ ] **Protect proof-of-payment files.** They are served publicly from `backend/public/uploads/` to anyone who has the (random) file name. Serve them through an admin-only endpoint instead.
- [ ] **Remove the plain-text password check** in `login.php` (`$data->password === $password_hash`). Check passwords with `password_verify` only, and re-hash any accounts that were seeded in plain text.
- [x] **Limit CORS** to the real frontend origin instead of allowing every origin. Done with sessions: `backend/config/Cors.php` only allows origins in `CORS_ALLOWED_ORIGINS`.
  - [ ] Set `CORS_ALLOWED_ORIGINS` to the production frontend URL when deploying (and `SESSION_SAMESITE=None` + HTTPS if the frontend and API are on different sites).
- [ ] **Rate-limit login** to slow down brute-force attempts.

## 2. Member features (currently front-end only, with hard-coded data)

Each item needs a database table, a PHP endpoint and the matching frontend page wired to it.

- [ ] **CPD tracking:** record CPD units per member. Progress is currently fixed at 65% (`CPD.jsx:10`).
- [ ] **Certifications:** store and list each member's certificates (`Certification.jsx`).
- [ ] **Electronic logbook:** create, list and verify procedure logs (`Logbook.jsx`).
- [ ] **Forum:** threads, replies and moderation (`Forum.jsx`).
- [ ] **Clinical library:** resource list and file downloads (`Library.jsx`).
- [ ] **Procedure videos:** video list stored in the database, plus embed or playback (`Videos.jsx`).
- [ ] **Profile:** save edits to the database (they are only written to browser storage at `Profile.jsx:58`) and support member photo uploads.
- [ ] **Admin tools** to manage the content above (CPD approvals, library and video uploads, forum moderation, logbook verification).

## 3. Other incomplete features

- [ ] **Contact form:** send or store messages. It currently only calls `console.log` and shows an `alert` (`Contact.jsx:10`).
- [ ] **Contact page map:** replace the placeholder with an embedded map.
- [ ] **Content pages** (News, Achievements, Career, Work With Us): decide whether admins should manage them through the backend instead of hard-coded content.
- [ ] **Password reset / forgot password.**
- [x] **Logout on the server side.** Done with sessions: `logout.php` destroys the session; dashboards call `logout()` from `api.js`.
- [ ] **Notify applicants** when their membership application is approved or rejected.

## 4. Backend integration & deployment

- [ ] **Enable the backend in production.** Set `VITE_BACKEND_ENABLED=true` and `VITE_API_BASE_URL`; the "integration is under development" message shows until then.
- [ ] **Extend `backend/database/schema.sql` and `bin/migrate.php`** for the new tables in section 2.
- [ ] **Choose hosting** for the frontend and the PHP/MySQL backend, set the environment variables (`DB_*`, `CORS_ALLOWED_ORIGINS`, `SESSION_*`; see `backend/.env.example`), and set the document root to `backend/public`.
- [ ] **Add backend tests** (only connection diagnostics exist) and a PHP lint/test step to CI.

## 5. Cleanup

- [ ] **Shrink large images:** `dermats.png` (8.3 MB), `work.png` (6 MB) and `board.png` (4.9 MB). Convert them to WebP or JPG and resize.
- [x] **Remove committed test uploads** from `backend/public/uploads/` and `backend/public/api/uploads/`, and add both folders to `.gitignore` (keep the `.gitkeep` and `.htaccess` files). Done 2026-11-06: untracked from git (still on disk) and ignored in `backend/.gitignore`.
  - [ ] The files are still in git history. If any are real proof-of-payment documents, purge them from history (e.g. `git filter-repo`) before the repo is made public.
- [x] **Remove `.vite/` and root `node_modules/` / `package-lock.json`** from the repo root and add them to `.gitignore`. Done 2026-11-06: untracked from git and ignored in the root `.gitignore`. The local files can be deleted safely.
- [ ] **Remove the duplicate `/Gallery-admin` route** in `App.jsx`.
- [x] **Fix the README wording:** "dental and nursing literature" should match ADANP's dermatology focus, and fix the typo "confguration".
- [ ] **Update `actions/checkout` and `actions/setup-node`** in CI from v3 to v4.
