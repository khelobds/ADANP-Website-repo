import { useEffect, useSyncExternalStore } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RequireAuth from './components/RequireAuth';
import Home from './pages/Home';
import About from './pages/About';
import Board from './pages/Board';
import Certification from './pages/Certification';
import Membership from './pages/Membership';
import Education from './pages/Education';
import Policy from './pages/Policy';
import News from './pages/News';
import Gallery from './pages/Gallery';
import GalleryAdmin from './pages/GalleryAdmin';
import WorkWithUs from './pages/WorkWithUs';
import Contact from './pages/Contact';
import Login from './pages/Login';
import NonMemberDashboard from './pages/NonMemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import Profile from './pages/Profile';
import CPD from './pages/CPD';
import Library from './pages/Library';
import Videos from './pages/Videos';
import Logbook from './pages/Logbook';
import Legal from './pages/Legal';
import Career from './pages/Career';
import Forum from './pages/Forum';
import Achievements from './pages/Achievements';
import Preview, { previewEnabled } from './pages/Preview';
import { clearBackendNotice, getBackendNotice, subscribeToBackendNotice, subscribeToUnauthorized } from './config/api';
import { Analytics } from '@vercel/analytics/react';









// Roles allowed on each protected route (backend table names, as returned by login.php/me.php).
const ADMIN = ['admin_user'];
const MEMBER = ['members'];
const NON_MEMBER = ['non_members'];

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  // Any API call that comes back 401 means the session is gone: send the user to log in again.
  useEffect(() => subscribeToUnauthorized(() => navigate('/login', { replace: true })), [navigate]);
  const backendNotice = useSyncExternalStore(subscribeToBackendNotice, getBackendNotice);
  const isLoginPage = location.pathname === '/login';
  const isGalleryAdminPage = location.pathname === '/gallery-admin' || location.pathname === '/Gallery-admin';
  const isDashboardPage = location.pathname.includes('dashboard') || location.pathname === '/profile' || location.pathname === '/cpd' || location.pathname === '/library' || location.pathname === '/videos' || location.pathname === '/logbook' || location.pathname === '/legal' || location.pathname === '/career' || location.pathname === '/forum' || location.pathname === '/achievements'; 


  return (
    <div className="app">
      {backendNotice && (
        <div className="backend-notice" role="alert">
          <span>{backendNotice}</span>
          <button type="button" onClick={clearBackendNotice} aria-label="Dismiss backend notice">Dismiss</button>
        </div>
      )}
      {!isLoginPage && !isGalleryAdminPage && !isDashboardPage && <a href="#main-content" className="skip-link">Skip to main content</a>}
      {!isGalleryAdminPage && !isDashboardPage && <Navbar />}
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/board" element={<Board />} />
          <Route path="/certification" element={<Certification />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/education" element={<Education />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery-admin" element={<RequireAuth roles={ADMIN}><GalleryAdmin /></RequireAuth>} />
          <Route path="/Gallery-admin" element={<RequireAuth roles={ADMIN}><GalleryAdmin /></RequireAuth>} />
          <Route path="/work-with-us" element={<WorkWithUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/non-member-dashboard" element={<RequireAuth roles={NON_MEMBER}><NonMemberDashboard /></RequireAuth>} />
          <Route path="/admin-dashboard" element={<RequireAuth roles={ADMIN}><AdminDashboard /></RequireAuth>} />
          <Route path="/member-dashboard" element={<RequireAuth roles={MEMBER}><MemberDashboard /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth roles={MEMBER}><Profile /></RequireAuth>} />
          <Route path="/cpd" element={<RequireAuth roles={MEMBER}><CPD /></RequireAuth>} />
          <Route path="/library" element={<RequireAuth roles={MEMBER}><Library /></RequireAuth>} />
          <Route path="/videos" element={<RequireAuth roles={MEMBER}><Videos /></RequireAuth>} />
          <Route path="/logbook" element={<RequireAuth roles={MEMBER}><Logbook /></RequireAuth>} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/career" element={<Career />} />
          <Route path="/forum" element={<RequireAuth roles={MEMBER}><Forum /></RequireAuth>} />
          <Route path="/achievements" element={<Achievements />} />
          {previewEnabled && <Route path="/preview" element={<Preview />} />}
        </Routes>
      </main>
      {!isLoginPage && !isGalleryAdminPage && !isDashboardPage && <Footer />}
    </div>
  );
}

function App() {  
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <AppContent />
    </Router>
  )
}

export default App;
