import React, { useState, useEffect, useRef } from 'react';
import './PhotoGalleryModal.css';

const API_URL = 'http://localhost:8000/adanp-back';

const PhotoGalleryModal = ({ isOpen, onClose, onSave }) => {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Fetch images when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/gallery.php?type=image`);
      const data = await response.json();
      if (data.status === 'success') {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      setMessage({ type: 'error', text: 'Some files were skipped (only JPG, JPEG, PNG allowed)' });
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
        // Refresh images
        fetchImages();
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to connect to server' });
    }

    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`${API_URL}/delete.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      const data = await response.json();

      if (data.status === 'success') {
        setImages(prev => prev.filter(img => img.id !== id));
        setMessage({ type: 'success', text: 'Image deleted' });
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
    <div className="photo-modal-overlay">
      <div className="photo-modal-content">
        <h2 className="photo-modal-title">Photo Gallery</h2>

        {message.text && (
          <div className={`photo-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        <div className="photo-upload-section">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button 
            className="photo-select-btn"
            onClick={() => fileInputRef.current.click()}
          >
            Select Images
          </button>

          {/* Preview Grid */}
          {previews.length > 0 && (
            <div className="photo-preview-grid">
              {previews.map((preview, index) => (
                <div key={index} className="photo-preview-item">
                  <img src={preview.preview} alt={preview.name} />
                  <button 
                    className="photo-preview-remove"
                    onClick={() => removePreview(index)}
                  >
                    ×
                  </button>
                  <span className="photo-preview-name">{preview.name}</span>
                </div>
              ))}
            </div>
          )}

          {previews.length > 0 && (
            <button 
              className="photo-upload-btn"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : `Upload ${previews.length} Image(s)`}
            </button>
          )}
        </div>

        {/* Gallery Grid */}
        <div className="photo-gallery-section">
          <h3>Uploaded Images ({images.length})</h3>
          {images.length === 0 ? (
            <p className="photo-empty">No images uploaded yet</p>
          ) : (
            <div className="photo-gallery-grid">
              {images.map(image => (
                <div key={image.id} className="photo-gallery-item">
                  <img 
                    src={`${API_URL}/${image.file_path}`} 
                    alt={image.file_name} 
                  />
                  <button 
                    className="photo-delete-btn"
                    onClick={() => handleDelete(image.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="photo-modal-actions">
          <button className="photo-modal-btn photo-modal-cancel" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoGalleryModal;
