# ADANP Web Platform — TODO

Unfinished features and tasks, grouped by priority. Last reviewed: 2026-11-06.

## 1. Security (fix before going live)

- [x] **Stop uploads from running as code.** `backend/public/api/upload.php` trusts the browser-supplied MIME type (`$files['type']`) and keeps the original file extension, so a `.php` file sent as `image/png` is saved into the web-served `api/uploads/` folder and can then be executed.
  - Check the real type on the server with `finfo`, and choose the extension from an allowlist based on that type.
  - Turn off PHP execution in `api/uploads/` and `uploads/` (with `.htaccess` or the web server config).
  - Apply the same server-side check to the proof-of-payment upload in `submit_application.php`, which currently checks only the extension.
- [ ] **Add server-side sessions.** `login.php` returns user data but no session or token, so later requests can't be tied to a logged-in user. Use PHP sessions or a signed token.
- [ ] **Require an admin login on admin endpoints:** `delete.php`, `update_application.php`, `get_all_applications.php`, `upload.php`.
- [ ] **Protect frontend routes.** Add route guards in `frontend/src/App.jsx` for `/admin-dashboard`, `/gallery-admin`, `/member-dashboard`, `/non-member-dashboard`, `/profile`, `/cpd`, `/library`, `/videos`, `/logbook` and `/forum`. Right now anyone can open them by typing the URL.
- [ ] **Remove the plain-text password check** in `login.php` (`$data->password === $password_hash`). Check passwords with `password_verify` only, and re-hash any accounts that were seeded in plain text.
- [ ] **Limit CORS** to the real frontend origin instead of allowing every origin.
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
- [ ] **Logout on the server side** (it only clears browser storage today).
- [ ] **Notify applicants** when their membership application is approved or rejected.

## 4. Backend integration & deployment

- [ ] **Enable the backend in production.** Set `VITE_BACKEND_ENABLED=true` and `VITE_API_BASE_URL`; the "integration is under development" message shows until then.
- [ ] **Extend `backend/database/schema.sql` and `bin/migrate.php`** for the new tables in section 2.
- [ ] **Choose hosting** for the frontend and the PHP/MySQL backend, set the environment variables, and set the document root to `backend/public`.
- [ ] **Add backend tests** (only connection diagnostics exist) and a PHP lint/test step to CI.

## 5. Cleanup

- [ ] **Shrink large images:** `dermats.png` (8.3 MB), `work.png` (6 MB) and `board.png` (4.9 MB). Convert them to WebP or JPG and resize.
- [ ] **Remove committed test uploads** from `backend/public/uploads/` and `backend/public/api/uploads/`, and add both folders to `.gitignore` (keep the `.gitkeep` files).
- [ ] **Remove `.vite/` and root `node_modules/` / `package-lock.json`** from the repo root and add them to `.gitignore`.
- [ ] **Remove the duplicate `/Gallery-admin` route** in `App.jsx`.
- [x] **Fix the README wording:** "dental and nursing literature" should match ADANP's dermatology focus, and fix the typo "confguration".
- [ ] **Update `actions/checkout` and `actions/setup-node`** in CI from v3 to v4.
