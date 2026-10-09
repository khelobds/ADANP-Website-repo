# ADANP Web Platform Technical Documentation

##  Architecture Overview

The ADANP platform follows a decoupled architecture with a React-based frontend and a PHP-based backend.

### Frontend
- **Framework**: Vite + React
- **State Management**: React Hooks (useState, useEffect)
- **Routing**: Client-side routing with `react-router-dom`
- **Component Strategy**: Atomic-inspired components (Buttons, Cards, Modals) for consistency.

### Backend
- **Core Unit**: PHP scripts acting as REST API endpoints.
- **Data Persistence**: MySQL database using the `adanp_portal` schema.
- **File Handling**: Uploads are directory-stored with paths saved in the database.

---

##  Detailed Directory Structure

### `frontend/src/pages`
This directory contains the main views of the application.

- **`Home.jsx`**: Public landing page with overview and calls to action.
- **`About.jsx`**: History and mission of ADANP.
- **`Education.jsx` / `Library.jsx`**: Educational resources and clinical library.
- **`Logbook.jsx`**: Interactive form and list for logging clinical procedures.
- **`CPD.jsx`**: Dashboard for tracking professional development units.
- **`MemberDashboard.jsx`**: Navigation hub for verified members.
- **`AdminDashboard.jsx` / `GalleryAdmin.jsx`**: Management tools for administrative users.
- **`Login.jsx`**: Authentication portal for all user types.
- **`Forum.jsx`**: Community discussion board.

### `frontend/src/components`
Reusable UI units.

- **`Sidebar.jsx`**: Navigation menu for dashboards (Admin/Member/Non-Member).
- **`Navbar.jsx`**: Public navigation header.
- **`PhotoGalleryModal.jsx` / `VideoGalleryModal.jsx`**: Media view layers.
- **`ConfirmationModal.jsx`**: Generic modal for confirming destructive actions.
- **`Table.jsx`**: Standardized data display for logs and applications.

### `backend/public/api`
PHP entry points served as the API. Configure the web server document root as `backend/public` so database configuration, database scripts, and tests are not web-accessible.

- **`login.php`**: Validates credentials and returns session data/status.
- **`register.php`**: Handles account creation for new users.
- **`upload.php`**: Generic file upload handler for gallery and documents.
- **`submit_application.php`**: Processes membership applications and saves proof of payment.
- **`get_application_status.php`**: Allows non-members to track their application progress.

### Other backend directories

- **`backend/config`**: Database connection configuration. Connection values are read from `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_CHARSET`.
- **`backend/database`**: Database schema and related assets.
- **`backend/bin`**: Command-line maintenance utilities; `migrate.php` is CLI-only.
- **`backend/public/api/uploads`**: Gallery uploads served under `/api/uploads`.
- **`backend/public/uploads`**: Membership application proof uploads served under `/uploads`.
- **`backend/tests`**: Local database diagnostic scripts.

---

##  Database Schema Details

The system uses several key tables to manage users and content:

| Table | Purpose |
| :--- | :--- |
| `admin_user` | Stores administrative credentials. |
| `members` | Verified users with full platform access. |
| `non_members` | Registered guests who haven't been approved yet. |
| `non_member_applications` | Holds pending/rejected/approved membership records. |
| `gallery` | Metadata for images and videos displayed on the site. |

---

##  Styling System
The project uses modular vanilla CSS. 
- **Base Styles**: Managed via standard CSS files per component/page.
- **Theme**: Shifting from a semi-transparent "Glassmorphism" look to a clean, professional "State-of-the-Art" UI with solid backgrounds (`#ffffff`), light blue accents, and strong typography (Inter/Roboto).
- **Color Palette**:
    - Primary: Dark Red (`#cf2e2e`) - applied to sidebars and headers.
    - Background: Light Gray/Blue for dashboards.
    - Text: Dark Charcoal for legibility.

---

##  Workflow & Development

### Adding a New Page
1. Create `NewPage.jsx` and `NewPage.css` in `frontend/src/pages`.
2. Register the route in `frontend/src/App.jsx`.
3. Add a link to the page in the appropriate `Sidebar.jsx` or `Navbar.jsx`.

### Adding a New API Endpoint
1. Create an `endpoint_name.php` in `backend/public/api`.
2. Load the database configuration with `require_once __DIR__ . '/../../config/Database.php';`.
3. Use PDO for queries and return JSON via `echo json_encode()`.
