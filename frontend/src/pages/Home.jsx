import { Link } from 'react-router-dom';
import { FaBullseye, FaEye, FaStar, FaHandshake, FaScroll, FaGraduationCap, FaHeart } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import logo from '../assets/adanp-logo.jpg';
import dermas from '../assets/dermats.png';
import woman from '../assets/woman.png';
import './Home.css';

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <Hero
        title="Association of Dermatology & Aesthetic Nurses of the Philippines"
        subtitle="ADANP"
        backgroundImage={dermas}
        primaryButton={{ to: '/membership', text: 'Join Now' }}
        secondaryButton={{ to: '/certification', text: 'Get Certified' }}
      />

      {/* Introduction Section */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Welcome to ADANP</h2>
        </div>
        <div className="home-intro">
          <div className="intro-text">
            <p className="lead-text">
              The Association of Dermatology and Aesthetic Nurses of the Philippines (ADANP)
              is the premier professional organization dedicated to advancing the practice
              of dermatology and aesthetic nursing in the Philippines.
            </p>
            <p>
              We are committed to empowering Filipino nurses through education, certification,
              and professional development programs that uphold the highest standards of
              patient care and safety in dermatology and aesthetic practice.
            </p>
          </div>
          <div className="intro-image">
            <img src={woman} alt="woman" />
          </div>
        </div>
        <div className="home-cta-grid grid-3">
          <Card title="Certification Programs" subtitle="Advance Your Career">
            <p>
              Become a Certified Aesthetic Nurse (CAN), Dermatology Nurse Practitioner (DNP),
              or join our Fellowship Program (FADANP).
            </p>
            <Link to="/certification" className="btn btn-outline-navy btn-small">
              Learn More
            </Link>
          </Card>
          <Card title="Membership" subtitle="Join Our Community">
            <p>
              Connect with fellow professionals, access exclusive resources, and grow
              your network in dermatology and aesthetic nursing.
            </p>
            <Link to="/membership" className="btn btn-outline-navy btn-small">
              Become a Member
            </Link>
          </Card>
          <Card title="Education" subtitle="Continuous Learning">
            <p>
              Access continuing professional development, seminars, and research
              opportunities to stay at the forefront of your field.
            </p>
            <Link to="/education" className="btn btn-outline-navy btn-small">
              Explore Programs
            </Link>
          </Card>
        </div>
      </Section>

      {/* Mission & Vision Preview */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Our Purpose</h2>
        </div>
        <div className="mission-vision-grid grid-2">
          <InfoBox
            icon={<FaBullseye />}
            title="Our Mission"
            variant="default"
          >
            <p>
              To lead the Filipino nurses in providing an advanced quality of care, through
              competency-based practice, in dermatology and aesthetic nursing.
            </p>
          </InfoBox>
          <InfoBox
            icon={<FaEye />}
            title="Our Vision"
            variant="default"
          >
            <p>
              To empower and uplift Filipino nurse’s professional practice standards independently in
              providing patient care and safety in dermatology and aesthetic nursing.
            </p>
          </InfoBox>
        </div>
        <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
          <Link to="/about" className="btn btn-primary">
            Learn More About Us
          </Link>
        </div>
      </Section>

      {/* Core Values */}
      <Section variant="navy">
        <div className="section-header">
          <h2 className="section-title">Our Core Values</h2>
        </div>
        <div className="values-grid grid-5">
          <div className="value-item">
            <span className="value-icon"><FaStar /></span>
            <h4>Excellence</h4>
          </div>
          <div className="value-item">
            <span className="value-icon"><FaHandshake /></span>
            <h4>Integrity</h4>
          </div>
          <div className="value-item">
            <span className="value-icon"><FaScroll /></span>
            <h4>Professionalism</h4>
          </div>
          <div className="value-item">
            <span className="value-icon"><FaGraduationCap /></span>
            <h4>Competency</h4>
          </div>
          <div className="value-item">
            <span className="value-icon"><FaHeart /></span>
            <h4>Service</h4>
          </div>
        </div>
      </Section>

      {/* News & Events Preview */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Latest News & Events</h2>
          <p className="section-subtitle">
            Stay updated with our upcoming events, conventions, and announcements
          </p>
        </div>
        <div className="news-grid grid-3">
          <Card title="Annual Convention 2026" subtitle="Upcoming Event">
            <p>
              Join us for our annual national convention featuring expert speakers,
              workshops, and networking opportunities.
            </p>
            <Link to="/news" className="btn btn-outline-navy btn-small">
              View Details
            </Link>
          </Card>
          <Card title="Certification Exam Schedule" subtitle="Important Dates">
            <p>
              Mark your calendars for the upcoming Certified Aesthetic Nurse and
              Dermatology Nurse Practitioner examinations.
            </p>
            <Link to="/certification" className="btn btn-outline-navy btn-small">
              View Schedule
            </Link>
          </Card>
          <Card title="Continuing Education Program" subtitle="Professional Development">
            <p>
              Enroll in our latest CPD programs and seminars to enhance your
              dermatology and aesthetic nursing skills.
            </p>
            <Link to="/education" className="btn btn-outline-navy btn-small">
              Learn More
            </Link>
          </Card>
        </div>
        <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
          <Link to="/news" className="btn btn-outline-navy">
            View All News & Events
          </Link>
        </div>
      </Section>

      {/* Call to Action */}
      <Section variant="gold">
        <div className="cta-section text-center">
          <h2>Ready to Advance Your Career?</h2>
          <p>
            Join ADANP today and become part of a growing community of dedicated
            dermatology and aesthetic nurses in the Philippines.
          </p>
          <div className="cta-buttons">
            <Link to="/membership" className="btn btn-secondary btn-large">
              Become a Member
            </Link>
            <Link to="/contact" className="btn btn-outline-navy btn-large">
              Contact Us
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Home;
