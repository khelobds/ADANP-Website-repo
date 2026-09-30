import { FaMapMarkerAlt, FaFileDownload, FaTrophy, FaStar, FaMicroscope, FaCalendarAlt, FaNewspaper, FaAward } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import './News.css';

function News() {
  const pressReleases = [
    {
      id: 1,
      title: '',
      date: '',
      excerpt: ''
    },
    {
      id: 2,
      title: '',
      date: '',
      excerpt: ''
    },
    {
      id: 3,
      title: '',
      date: '',
      excerpt: ''
    }
  ];

  const calendarEvents = [
    { date: '', event: '', location: '' },
    { date: '', event: '', location: '' },
    { date: '', event: '', location: '' },
    { date: '', event: '', location: '' },
    { date: '', event: '', location: '' },
    { date: '', event: '', location: '' },
  ];

  const conventionHighlights = [
    'Keynote speeches from international dermatology experts',
    'Hands-on workshops on advanced aesthetic procedures',
    'Research poster presentations and competitions',
    'Networking opportunities with industry leaders',
    'Annual General Assembly meeting',
    'Awards and recognition ceremony'
  ];

  const awards = [
    {
      title: 'Nurse of the Year Award',
      description: 'Recognizing outstanding contributions to dermatology and aesthetic nursing practice.',
      icon: <FaTrophy />
    },
    {
      title: 'Excellence in Education Award',
      description: 'Honoring members who demonstrate exceptional commitment to education and mentorship.',
      icon: <FaStar />
    },
    {
      title: 'Research Achievement Award',
      description: 'Celebrating significant contributions to dermatology nursing research.',
      icon: <FaMicroscope />
    },
    {
      title: 'Lifetime Achievement Award',
      description: 'Recognizing members who have dedicated their careers to advancing the profession.',
      icon: <FaAward />
    }
  ];

  return (
    <div className="news">
      {/* Hero Section */}
      <Hero
        title="News & Events"
        subtitle="Stay Updated"
        overlayColor="navy"
        backgroundImage="/newsbg.png"
      />

      {/* Media and Press Releases */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Media and Press Releases</h2>
          <p className="section-subtitle">
            Official statements, announcements, and press releases from ADANP
          </p>
        </div>
        <div className="press-releases-grid">
          {pressReleases.map((release) => (
            <div key={release.id} className="press-release-item">
              <div className="press-release-header">
                <span className="press-release-icon"><FaNewspaper /></span>
                <span className="press-release-date">{release.date}</span>
              </div>
              <h4 className="press-release-title">{release.title}</h4>
              <p className="press-release-excerpt">{release.excerpt}</p>
              <a href="#" className="download-link"><FaFileDownload /> Download PDF</a>
            </div>
          ))}
        </div>
      </Section>

      {/* Calendar of Activities */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Calendar of Activities</h2>
          <p className="section-subtitle">
            Upcoming events, seminars, examinations, and important dates
          </p>
        </div>
        <div className="calendar-content">
          <div className="calendar-list">
            <h3><FaCalendarAlt /> 2026 Schedule</h3>
            <ul className="event-list">
              {calendarEvents.map((event, index) => (
                <li key={index} className="event-item">
                  <div className="event-date">{event.date}</div>
                  <div className="event-details">
                    <h4>{event.event}</h4>
                    <span className="event-location"><FaMapMarkerAlt /> {event.location}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="calendar-cta">
            <h3>Host an Event</h3>
            <p>
              Interested in hosting an ADANP event in your region?
              Contact us to learn more about bringing our programs to your area.
            </p>
            <a href="/contact" className="btn btn-primary">Contact Us</a>
          </div>
        </div>
      </Section>

      {/* National Convention */}
      <Section variant="navy">
        <div className="section-header">
          <h2 className="section-title">National Convention</h2>
          <p className="section-subtitle">
            Join us for our biggest annual event
          </p>
        </div>
        <div className="convention-content">
          <div className="convention-info">
            <div className="convention-date">
              <FaCalendarAlt />
              <div>
                <h4></h4>
                <p>Manila, Philippines</p>
              </div>
            </div>
            <p className="convention-description">
              The ADANP National Convention is our premier annual event bringing together
              dermatology and aesthetic nursing professionals from across the Philippines
              for three days of learning, networking, and professional development.
            </p>
          </div>
          <div className="convention-highlights">
            <h3>Convention Highlights</h3>
            <ul>
              {conventionHighlights.map((highlight, index) => (
                <li key={index}> {highlight}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
          <a href="#" className="btn btn-primary">Register Now</a>
          <a href="#" className="btn btn-outline-light" style={{ marginLeft: 'var(--spacing-md)' }}>Learn More</a>
        </div>
      </Section>

      {/* Awards and Recognition */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Awards and Recognition</h2>
          <p className="section-subtitle">
            Celebrating excellence in dermatology and aesthetic nursing
          </p>
        </div>
        <div className="awards-grid">
          {awards.map((award, index) => (
            <div key={index} className="award-item">
              <span className="award-icon">{award.icon}</span>
              <h4>{award.title}</h4>
              <p>{award.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
          <a href="#" className="btn btn-outline-navy">View Past Recipients</a>
        </div>
      </Section>
    </div>
  );
}

export default News;
