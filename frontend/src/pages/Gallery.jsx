import { useState, useEffect } from 'react';
import { FaCamera, FaPlay } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import './Gallery.css';

const API_URL = 'http://localhost:8000/adanp-back';

function Gallery() {
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    try {
      // Fetch images
      const imageRes = await fetch(`${API_URL}/gallery.php?type=image`);
      const imageData = await imageRes.json();
      if (imageData.status === 'success') {
        setImages(imageData.data);
      }

      // Fetch videos
      const videoRes = await fetch(`${API_URL}/gallery.php?type=video`);
      const videoData = await videoRes.json();
      if (videoData.status === 'success') {
        setVideos(videoData.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
    setLoading(false);
  };

  return (
    <div className="gallery">
      {/* Hero Section */}
      <Hero
        title="Gallery"
        subtitle="Our Moments"
        overlayColor="navy"
        backgroundImage="/gallery.png"
      />

      {/* Photo Gallery */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Photo Gallery</h2>
          <p className="section-subtitle">
            Capturing moments from our events, trainings, and gatherings
          </p>
        </div>
        
        {loading ? (
          <p className="gallery-loading">Loading gallery...</p>
        ) : images.length === 0 ? (
          <p className="gallery-empty">No photos uploaded yet.</p>
        ) : (
          <div className="photo-grid">
            {images.slice(0, 6).map((image) => (
              <div key={image.id} className="photo-item">
                <div className="photo-image-wrapper">
                  <img 
                    src={`${API_URL}/${image.file_path}`} 
                    alt={image.file_name}
                    className="photo-image"
                  />
                </div>
                <div className="photo-info">
                  <span className="photo-category">Photo</span>
                  <h4>{image.file_name}</h4>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Video Section */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Video Gallery</h2>
          <p className="section-subtitle">
            Watch highlights from our events and educational content
          </p>
        </div>
        
        {loading ? (
          <p className="gallery-loading">Loading videos...</p>
        ) : videos.length === 0 ? (
          <p className="gallery-empty">No videos uploaded yet.</p>
        ) : (
          <div className="video-grid">
            {videos.map((video) => (
              <div key={video.id} className="video-item">
                <div className="video-wrapper">
                  <video 
                    src={`${API_URL}/${video.file_path}`}
                    controls
                    className="video-player"
                  />
                </div>
                <h4>{video.file_name}</h4>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Share Your Photos */}
      <Section variant="navy">
        <div className="share-cta text-center">
          <h3>Share Your ADANP Moments</h3>
          <p>
            Were you at an ADANP event? Share your photos with us!
            We'd love to feature your pictures in our gallery.
          </p>
          <a href="mailto:secretariat@adanp.org" className="btn btn-primary btn-large">
            Submit Photos
          </a>
        </div>
      </Section>
    </div>
  );
}

export default Gallery;
