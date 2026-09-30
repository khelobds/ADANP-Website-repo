import { FaGraduationCap, FaHospital, FaBuilding, FaGlobeAmericas, FaBriefcase, FaClipboardList } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import work from '../assets/work.png';
import './WorkWithUs.css';

function WorkWithUs() {
  return (
    <div className="work-with-us">
      {/* Hero Section */}
      <Hero
        title="Work With Us"
        subtitle="Partnerships & Opportunities"
        backgroundImage={work}
      />

      {/* Partners Section */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Our Partners</h2>
          <p className="section-subtitle">
            Collaborating with leading organizations to advance dermatology nursing
          </p>
        </div>
        <div className="partners-intro">
          <p>
            ADANP partners with academic institutions, healthcare organizations,
            industry leaders, and international associations to provide our
            members with the best resources, opportunities, and support.
          </p>
        </div>
        <div className="partner-types">
          <InfoBox icon={<FaGraduationCap />} title="Academic Partners" variant="default">
            <p>
              Universities and colleges offering dermatology nursing programs
              and continuing education courses.
            </p>
          </InfoBox>
          <InfoBox icon={<FaHospital />} title="Healthcare Institutions" variant="default">
            <p>
              Hospitals, clinics, and medical centers providing clinical
              training and employment opportunities.
            </p>
          </InfoBox>
          <InfoBox icon={<FaBuilding />} title="Industry Partners" variant="default">
            <p>
              Pharmaceutical companies and medical device manufacturers
              supporting education and research.
            </p>
          </InfoBox>
          <InfoBox icon={<FaGlobeAmericas />} title="International Associations" variant="default">
            <p>
              Global dermatology nursing organizations facilitating
              knowledge exchange and collaboration.
            </p>
          </InfoBox>
        </div>
      </Section>

      {/* Advertise Section */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Advertise With Us</h2>
          <p className="section-subtitle">
            Reach our community of dermatology and aesthetic nursing professionals
          </p>
        </div>
        <div className="advertise-content">
          <div className="advertise-info">
            <h3>Why Advertise with ADANP?</h3>
            <ul className="advertise-benefits">
              <li>
                <strong>Targeted Audience:</strong> Reach dermatology and
                aesthetic nursing professionals actively seeking products
                and services.
              </li>
              <li>
                <strong>Multiple Channels:</strong> Advertise through our
                journal, website, newsletter, and events.
              </li>
              <li>
                <strong>Brand Association:</strong> Align your brand with
                professional excellence and education.
              </li>
              <li>
                <strong>Engagement Opportunities:</strong> Sponsor events,
                workshops, and certification programs.
              </li>
            </ul>
          </div>
          <div className="advertise-options">
            <Card title="Journal Advertising" subtitle="Print & Digital">
              <p>
                Place your advertisement in the ADANP quarterly journal,
                reaching all members nationwide.
              </p>
            </Card>
            <Card title="Website Banner" subtitle="Online Presence">
              <p>
                Feature your brand on our website with strategic banner
                placements for maximum visibility.
              </p>
            </Card>
            <Card title="Event Sponsorship" subtitle="Direct Engagement">
              <p>
                Sponsor our annual convention, workshops, or regional
                events to connect directly with attendees.
              </p>
            </Card>
          </div>
        </div>
        <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
          <a href="mailto:partnership@adanp.org" className="btn btn-primary btn-large">
            Request Media Kit
          </a>
        </div>
      </Section>

      {/* Recruitment Section */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Recruitment</h2>
          <p className="section-subtitle">
            Find qualified dermatology and aesthetic nursing professionals
          </p>
        </div>
        <div className="recruitment-content">
          <div className="recruitment-info">
            <InfoBox icon={<FaBriefcase />} title="For Employers" variant="default">
              <p>
                ADANP connects employers with qualified dermatology and
                aesthetic nursing professionals through our job board
                and recruitment services.
              </p>
              <ul>
                <li>Post job openings</li>
                <li>Access member directory (with permission)</li>
                <li>Attend career fairs</li>
                <li>Partner for internship programs</li>
              </ul>
            </InfoBox>
          </div>
          <div className="recruitment-info">
            <InfoBox icon={<FaClipboardList />} title="For Job Seekers" variant="default">
              <p>
                ADANP members have access to exclusive job postings
                and career development resources.
              </p>
              <ul>
                <li>Job board access</li>
                <li>Career counseling</li>
                <li>Resume workshops</li>
                <li>Networking events</li>
              </ul>
            </InfoBox>
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section variant="navy">
        <div className="contact-partnership text-center">
          <h3>Interested in Partnering with ADANP?</h3>
          <p>
            Whether you want to advertise, recruit, or establish a
            partnership, we'd love to hear from you.
          </p>
          <div className="contact-emails">
            <p>
              <strong>Partnership Inquiries:</strong>{' '}
              <a href="mailto:partnership@adanp.org">partnership@adanp.org</a>
            </p>
            <p>
              <strong>General Opportunities:</strong>{' '}
              <a href="mailto:opportunities@adanp.org">opportunities@adanp.org</a>
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default WorkWithUs;
