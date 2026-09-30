import React, { useState, useEffect, useRef } from 'react';
import './VideoGalleryModal.css';

const API_URL = 'http://localhost:8000/adanp-back';

const VideoGalleryModal = ({ isOpen, onClose, onSave }) => {
  const [videos, setVideos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Fetch videos when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchVideos();
    }
  }, [isOpen]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery.php?type=video`);
      const data = await response.json();
      if (data.status === 'success') {
        setVideos(data.data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['video/mp4', 'video/webm'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      setMessage({ type: 'error', text: 'Some files were skipped (only MP4, WEBM allowed)' });
    }

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index) => {
    URL.revokeObjectURL(previews[index].preview);
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (previews.length === 0) {
      setMessage({ type: 'error', text: 'Please select files to upload' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    previews.forEach(preview => {
      formData.append('files[]', preview.file);
    });

    try {
      const response = await fetch(`${API_URL}/upload.php`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.status === 'success') {
        setMessage({ type: 'success', text: data.message });
        // Clear previews
        previews.forEach(p => URL.revokeObjectURL(p.preview));
        setPreviews([]);
        // Refresh videos
        fetchVideos();
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to server' });
    }

    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;

    try {
      const response = await fetch(`${API_URL}/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setVideos(prev => prev.filter(vid => vid.id !== id));
        setMessage({ type: 'success', text: 'Video deleted' });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete' });
    }
  };

  const handleClose = () => {
    previews.forEach(p => URL.revokeObjectURL(p.preview));
    setPreviews([]);
    setMessage({ type: '', text: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="video-modal-overlay">
      <div className="video-modal-content">
        <h2 className="video-modal-title">Video Gallery</h2>

        {message.text && (
          <div className={`video-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        <div className="video-upload-section">
          <input
            type="file"
            multiple
            accept="video/mp4,video/webm"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button 
            className="video-select-btn"
            onClick={() => fileInputRef.current.click()}
          >
            Select Videos
          </button>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="video-preview-grid">
              {previews.map((preview, index) => (
                <div key={index} className="video-preview-item">
                  <video src={preview.preview} controls />
                  <button 
                    className="video-preview-remove"
                    onClick={() => removePreview(index)}
                  >
                    ×
                  </button>
                  <span className="video-preview-name">{preview.name}</span>
                </div>
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <button 
              className="video-upload-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : `Upload ${previews.length} Video(s)`}
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="video-gallery-section">
          <h3>Uploaded Videos ({videos.length})</h3>
          {videos.length === 0 ? (
            <p className="video-empty">No videos uploaded yet</p>
          ) : (
            <div className="video-gallery-grid">
              {videos.map(video => (
                <div key={video.id} className="video-gallery-item">
                  <video 
                    src={`${API_URL}/${video.file_path}`} 
                    controls
                  />
                  <button 
                    className="video-delete-btn"
                    onClick={() => handleDelete(video.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="video-modal-actions">
          <button className="video-modal-btn video-modal-cancel" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoGalleryModal;
