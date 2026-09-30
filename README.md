# ADANP Web Platform

A comprehensive management and resource platform for the **Association of Dental Assistants and Nursing Professionals (ADANP)**.

This platform provides a centralized hub for members, non-members, and administrators to access clinical resources, track professional development, manage certifications, and engage with the community.

##  Key Features

### For Members
*   **My Profile & Credentials**: Manage personal information and professional licenses.
*   **CPD & Certifications**: Track Continuing Professional Development (CPD) points and certificates.
*   **Clinical Library**: Access a curated collection of dental and nursing literature.
*   **Procedure Videos**: Watch high-quality clinical procedure tutorials.
*   **Electronic Logbook**: Log and track clinical procedures for verification.
*   **Forum**: Engage in professional discussions and clinical case sharing.

### For Non-Members
*   **Membership Application**: Step-by-step process to apply for official ADANP membership.
*   **Public Resources**: Access to news, about us, and basic information.

### For Administrators
*   **User Management**: Approve or reject membership applications.
*   **Gallery Management**: Upload and manage images and videos for the platform.
*   **Dashboard Overview**: Monitor system status and member activity.

##  Tech Stack

### Frontend
*   **Framework**: [React](https://reactjs.org/) (powered by [Vite](https://vitejs.dev/))
*   **Routing**: React Router DOM (v6)
*   **Icons**: React Icons (Lucide)
*   **Styling**: Vanilla CSS (Modern design patterns, transition from glassmorphism to clean professional UI)

### Backend
*   **Language**: PHP (REST-like architecture)
*   **Database**: MySQL
*   **Connection**: PDO (PHP Data Objects) for secure database interaction

##  Project Structure

```text
adanp-web/
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page-level components
│   │   └── assets/        # Images, fonts, and static files
│   └── database_schema.sql # Database initialization script
├── backend/                # PHP backend
│   ├── adanp-back/        # Core API endpoints (PHP)
│   ├── config/            # Database configuration
│   └── uploads/           # User-uploaded files (proof of payment, etc.)
└── config/                 # Root-level configuration (Database.php)
```

##  Installation & Setup

### Prerequisites
*   Node.js (v18+)
*   PHP (v7.4+)
*   MySQL/MariaDB (via XAMPP, WAMP, or standalone)

### 1. Database Setup
1.  Create a database named `adanp_portal` in your MySQL server.
2.  Import `frontend/database_schema.sql` into the database.
3.  Configure `config/Database.php` with your local database credentials.

### 2. Backend Configuration
1.  Ensure your PHP server is running (e.g., Apache via XAMPP).
2.  The backend expects to be served from a local server (defaulted to `http://localhost`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

##  License
This project is proprietary and intended for the exclusive use of ADANP.
