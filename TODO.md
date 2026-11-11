# ADANP Web Platform — TODO

Unfinished features and tasks, grouped by priority. Last reviewed: 2026-11-06.

## 1. Security (fix before going live)

- [x] **Stop uploads from running as code.** Done 2026-11-06 and tested on XAMPP. `upload.php` and `submit_application.php` now detect the real type with `finfo`, take the saved extension from an allowlist for that type, and use random file names. `.htaccess` in `api/uploads/` and `uploads/` serves only media/PDF files and never runs PHP.
  - [x] If production runs on Nginx (or anything other than Apache), add the same "no scripts, media only" rule to the server config, since `.htaccess` is ignored there. Done 2026-11-11: `backend/deploy/nginx.conf.example` has the rules; copy it into the real server config when deploying on Nginx.
  - [ ] Try a photo, a video and a proof-of-payment upload through the website UI (only tested directly against the endpoints so far).
- [x] **Add server-side sessions.** Done 2026-11-06 and tested against the endpoints. PHP sessions via `backend/config/Auth.php` (HttpOnly cookie, strict mode, new session ID on login, idle timeout). `submit_application.php` and `get_application_status.php` take the user from the session instead of the request. CSRF protection: non-GET requests must carry `X-Requested-With`.
  - [ ] Test log in, log out, application submit/approve and gallery edits through the website UI in a browser (only tested with direct requests so far).
- [x] **Require an admin login on admin endpoints:** `delete.php`, `update_application.php`, `get_all_applications.php`, `upload.php` now call `requireLogin(array('admin_user'))`.
- [x] **Protect frontend routes.** Done 2026-11-11: `RequireAuth` (`frontend/src/components/RequireAuth.jsx`) wraps `/admin-dashboard`, `/gallery-admin`, `/member-dashboard`, `/non-member-dashboard`, `/profile`, `/cpd`, `/library`, `/videos`, `/logbook` and `/forum` in `App.jsx`. It checks the session with `me.php`: no session goes to `/login`, wrong role goes to that role's own dashboard. Any API call that returns 401 also sends the user to `/login`. `/legal`, `/career` and `/achievements` are public. While the backend is off, protected pages open without a login (for previewing) and show a demo user.
  - [ ] Test log in, wrong-role access and session expiry through the website UI with the backend running.
- [x] **Protect proof-of-payment files.** They are served publicly from `backend/public/uploads/` to anyone who has the (random) file name. Serve them through an admin-only endpoint instead. Done 2026-11-11: new proofs are saved in `backend/storage/proofs/` (outside the web root) and admins view them through `api/proof.php?id=<application id>`. `backend/public/uploads/` now serves nothing. `php backend/bin/move_proofs.php --apply` moves older proofs out of the public folder.
  - [ ] Run `php backend/bin/move_proofs.php --apply` on every database and server (each developer's copy and production).
- [x] **Remove the plain-text password check** in `login.php` (`$data->password === $password_hash`). Done 2026-11-11: `login.php` uses `password_verify` only. The old check also let anyone log in by sending an account's stored hash as the password. `php backend/bin/rehash_passwords.php` lists plain-text accounts and `--apply` hashes them (the password itself stays the same).
  - [ ] Run `php backend/bin/rehash_passwords.php --apply` on every database (each developer's local copy and production), or plain-text accounts there can no longer log in.
- [x] **Limit CORS** to the real frontend origin instead of allowing every origin. Done with sessions: `backend/config/Cors.php` only allows origins in `CORS_ALLOWED_ORIGINS`.
  - [ ] Set `CORS_ALLOWED_ORIGINS` to the production frontend URL when deploying (and `SESSION_SAMESITE=None` + HTTPS if the frontend and API are on different sites).
- [x] **Rate-limit login** to slow down brute-force attempts. Done 2026-11-11: failed logins are stored in `login_attempts`; after 5 failures for one email, or 20 across all emails, from the same IP within 15 minutes, `login.php` answers 429 with `Retry-After`. Limits are set with `LOGIN_*` (see `backend/.env.example`).
  - [ ] Run `php backend/bin/migrate.php` on every database to create the `login_attempts` table (until then logins work but are not limited).
  - [ ] If production sits behind a proxy or load balancer, pass the real client IP to PHP (see the end of `backend/deploy/nginx.conf.example`), or all visitors share one limit.

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
