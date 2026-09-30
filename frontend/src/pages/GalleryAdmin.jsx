import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GalleryAdmin.css';
import ConfirmationModal from '../components/ConfirmationModal';
import VideoGalleryModal from '../components/VideoGalleryModal';
import PhotoGalleryModal from '../components/PhotoGalleryModal';

const API_URL = 'http://localhost:8000/adanp-back';

const GalleryAdmin = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [currentGallery, setCurrentGallery] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [isClinic, setIsClinic] = useState(true); // Set to true for clinic mode
  const [photoCount, setPhotoCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [photoRes, videoRes] = await Promise.all([
        fetch(`${API_URL}/gallery.php?type=image`),
        fetch(`${API_URL}/gallery.php?type=video`)
      ]);
      
      const photoData = await photoRes.json();
      const videoData = await videoRes.json();
      
      if (photoData.status === 'success') {
        setPhotoCount(photoData.count);
      }
      if (videoData.status === 'success') {
        setVideoCount(videoData.count);
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const handleSettingsClick = () => {
    if (isClinic) {
      setShowLogout(!showLogout);
    }
  };

  const handleEditClick = (galleryType) => {
    setCurrentGallery(galleryType);
    setShowModal(true);
  };

  const handleConfirm = () => {
    console.log(`Editing ${currentGallery}`);
    setShowModal(false);
    
    // Show appropriate modal based on gallery type
    if (currentGallery === 'Video Gallery') {
      setShowVideoModal(true);
    } else if (currentGallery === 'Photo Gallery') {
      setShowPhotoModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/login');
  };

  const handleVideoModalClose = () => {
    setShowVideoModal(false);
  };

  const handleVideoModalSave = (categories) => {
    console.log('Saved video categories:', categories);
    setShowVideoModal(false);
  };

  const handlePhotoModalClose = () => {
    setShowPhotoModal(false);
  };

  const handlePhotoModalSave = (categories) => {
    console.log('Saved photo categories:', categories);
    setShowPhotoModal(false);
  };

  return (
    <div className="gallery-admin">

      {/* Top Navigation Bar */}
      <header className="admin-header">

        {/* Left: logo + admin pill */}
        <div className="header-left">
          <div className="logo-circle">
            <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <div className="admin-info">
            <div className="admin-pill-row">
              <span className="status-dot"></span>
              <div className="admin-pill">
                <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
                <span>Admin</span>
              </div>
            </div>
            <span className="status-label">Status: Active</span>
          </div>
        </div>

        {/* Right: gear icon + logout button — both inline in the header */}
        <div className="header-right">
          <div className="settings-icon" onClick={handleSettingsClick}>
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a6.97 6.97 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.61-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.37 1.04.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.48.48 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
          </div>
          {showLogout && isClinic && (
            <button className="logout-btn" onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          )}
        </div>

      </header>

      {/* Main Content — navy padding = visible border frame */}
      <main className="admin-main">
        <div className="main-frame">
          <div className="background-overlay"></div>
          <div className="content-wrapper">
            <h1 className="page-title">Gallery</h1>

            <div className="gallery-cards">

              {/* Photo Gallery Card */}
              <div className="gallery-card">
                <div className="card-thumb-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1612532275214-e4ca76d0e4d1?w=200&q=80"
                    alt="Photo Gallery"
                    className="card-thumb"
                  />
                </div>
                <button className="gallery-label-btn">Photo Gallery</button>
                <div className="card-info">
                  <p>Total uploads: {photoCount}</p>
                </div>
                <button className="edit-btn" onClick={() => handleEditClick('Photo Gallery')}>Edit</button>
              </div>

              {/* Video Gallery Card */}
              <div className="gallery-card">
                <div className="card-thumb-wrap">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&q=80"
                    alt="Video Gallery"
                    className="card-thumb"
                  />
                </div>
                <button className="gallery-label-btn">Video Gallery</button>
                <div className="card-info">
                  <p>Total uploads: {videoCount}</p>
                </div>
                <button className="edit-btn" onClick={() => handleEditClick('Video Gallery')}>Edit</button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        message="Are you sure you want to make changes?"
      />

      <VideoGalleryModal
        isOpen={showVideoModal}
        onClose={handleVideoModalClose}
        onSave={handleVideoModalSave}
      />

      <PhotoGalleryModal
        isOpen={showPhotoModal}
        onClose={handlePhotoModalClose}
        onSave={handlePhotoModalSave}
      />

    </div>
  );
};

export default GalleryAdmin;