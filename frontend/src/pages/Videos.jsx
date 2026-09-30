import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaPlay, FaRegClock, FaEye, FaTimes, FaFilm, FaShieldAlt, FaChalkboardTeacher } from 'react-icons/fa';
import './Videos.css';

const Videos = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    const videoData = [
        {
            id: 1,
            title: 'Advanced Chemical Peel Techniques',
            category: 'tutorial',
            duration: '15:42',
            views: '1.2k',
            date: '2 weeks ago',
            thumbnail: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc2069?q=80&w=1170'
        },
        {
            id: 2,
            title: 'Q1 Global Dermatology Update 2024',
            category: 'webinar',
            duration: '58:20',
            views: '850',
            date: '1 month ago',
            thumbnail: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?q=80&w=1169'
        },
        {
            id: 3,
            title: 'Managing Vascular Occlusions in Fillers',
            category: 'safety',
            duration: '12:15',
            views: '2.5k',
            date: '3 days ago',
            thumbnail: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=1170'
        },
        {
            id: 4,
            title: 'Laser Safety Standards & Protocols',
            category: 'tutorial',
            duration: '22:10',
            views: '940',
            date: '2 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a30?q=80&w=1170'
        },
        {
            id: 5,
            title: 'Post-Seminar Q&A: Aesthetic Complications',
            category: 'webinar',
            duration: '45:00',
            views: '620',
            date: '5 months ago',
            thumbnail: 'https://images.unsplash.com/photo-1577563906417-45a11b6401cc?q=80&w=1170'
        },
        {
            id: 6,
            title: 'Anaphylaxis Management in Outpatient Settings',
            category: 'safety',
            duration: '08:45',
            views: '3.1k',
            date: '1 week ago',
            thumbnail: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?q=80&w=1170'
        }
    ];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const filteredVideos = activeCategory === 'all' 
        ? videoData 
        : videoData.filter(v => v.category === activeCategory);

    const getCategoryIcon = (cat) => {
        switch(cat) {
            case 'tutorial': return <FaChalkboardTeacher />;
            case 'webinar': return <FaFilm />;
            case 'safety': return <FaShieldAlt />;
            default: return null;
        }
    };

    if (!user) return null;

    return (
        <div className="videos-layout">
            <Sidebar />
            <div className="videos-main-area">
                <header className="videos-topbar">
                    <h2 className="topbar-title">Procedure Videos</h2>
                    <div className="topbar-user">
                        <span>Welcome, <strong>{user.full_name}</strong></span>
                    </div>
                </header>

                <div className="videos-content-container">
                    {/* Category Filter */}
                    <div className="video-categories">
                        <div 
                            className={`category-chip ${activeCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            All Videos
                        </div>
                        <div 
                            className={`category-chip ${activeCategory === 'tutorial' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('tutorial')}
                        >
                            <FaChalkboardTeacher /> Tutorials
                        </div>
                        <div 
                            className={`category-chip ${activeCategory === 'webinar' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('webinar')}
                        >
                            <FaFilm /> Webinar Archives
                        </div>
                        <div 
                            className={`category-chip ${activeCategory === 'safety' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('safety')}
                        >
                            <FaShieldAlt /> Safety Protocols
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className="video-grid">
                        {filteredVideos.map(video => (
                            <div key={video.id} className="video-card" onClick={() => setSelectedVideo(video)}>
                                <div className="video-thumbnail">
                                    <img src={video.thumbnail} alt={video.title} />
                                    <div className="play-overlay">
                                        <FaPlay />
                                    </div>
                                    <span className="video-duration">{video.duration}</span>
                                    <span className="video-badge">{video.category}</span>
                                </div>
                                <div className="video-info">
                                    <h3>{video.title}</h3>
                                    <div className="video-meta">
                                        <div className="video-views">
                                            <FaEye /> {video.views} views
                                        </div>
                                        <span>{video.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Video Player Modal */}
            {selectedVideo && (
                <div className="video-modal-overlay" onClick={() => setSelectedVideo(null)}>
                    <div className="video-player-container" onClick={e => e.stopPropagation()}>
                        <button className="close-video" onClick={() => setSelectedVideo(null)}>
                            <FaTimes /> Close Player
                        </button>
                        <div className="video-placeholder">
                            <FaPlay size={100} color="#c99339" style={{ marginBottom: '20px' }} />
                            <h2>Now Playing: {selectedVideo.title}</h2>
                            <p>High-definition video content is currently limited to authorized official members.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Videos;
