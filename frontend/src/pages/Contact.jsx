import { FaPhone, FaEnvelope, FaClipboardList, FaGraduationCap, FaHandshake, FaLaptop, FaCoins, FaBullhorn, FaMapMarkerAlt } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import ContactForm from '../components/ContactForm';
import InfoBox from '../components/InfoBox';
import contact  from '../assets/contact.png';
import './Contact.css';

function Contact() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="contact">
      {/* Hero Section */}
      <Hero
        title="Contact Us"
        subtitle="Get in Touch"
        backgroundImage={contact}
        overlayColor="navy"
      />

      {/* Contact Form & Info */}
      <Section variant="white">
        <div className="contact-grid">
          <div className="contact-form-section">
            <h3 className="form-title">Send Us a Message</h3>
            <p className="form-subtitle">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <ContactForm onSubmit={handleSubmit} />
          </div>
          <div className="contact-info-section">
            <h3 className="info-title">Contact Information</h3>
            <div className="info-cards">
              <InfoBox icon={<FaPhone />} title="Phone" variant="light">
                <p><strong>Landline:</strong></p>
                <p>(02) 899 6471</p>
                <p><strong>Mobile:</strong></p>
                <p>0945 5933868</p>
              </InfoBox>
              <InfoBox icon={<FaEnvelope />} title="General Inquiries" variant="light">
                <a href="mailto:admin@adanp.org">admin@adanp.org</a>
                <a href="mailto:secretariat@adanp.org">secretariat@adanp.org</a>
              </InfoBox>
            </div>
          </div>
        </div>
      </Section>

      {/* Department Emails */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Department Contacts</h2>
          <p className="section-subtitle">
            Reach out to the appropriate department for faster assistance
          </p>
        </div>
        <div className="departments-grid">
          <div className="department-card">
            <span className="dept-icon"><FaClipboardList /></span>
            <h4>Membership</h4>
            <a href="mailto:membership@adanp.org">membership@adanp.org</a>
            <p>For membership applications, renewals, and benefits inquiries.</p>
          </div>
          <div className="department-card">
            <span className="dept-icon"><FaGraduationCap /></span>
            <h4>Certification</h4>
            <a href="mailto:professionalconcerns@adanp.org">professionalconcerns@adanp.org</a>
            <p>For certification programs, exams, and professional concerns.</p>
          </div>
          <div className="department-card">
            <span className="dept-icon"><FaHandshake /></span>
            <h4>Partnership</h4>
            <a href="mailto:partnership@adanp.org">partnership@adanp.org</a>
            <p>For partnership opportunities and collaborations.</p>
          </div>
          <div className="department-card">
            <span className="dept-icon"><FaLaptop /></span>
            <h4>Technical Support</h4>
            <a href="mailto:techsupport@adanp.org">techsupport@adanp.org</a>
            <p>For website issues and technical assistance.</p>
          </div>
          <div className="department-card">
            <span className="dept-icon"><FaCoins /></span>
            <h4>Accounting</h4>
            <a href="mailto:accounting@adanp.org">accounting@adanp.org</a>
            <p>For payment inquiries and financial matters.</p>
          </div>
          <div className="department-card">
            <span className="dept-icon"><FaBullhorn /></span>
            <h4>Professional Concerns</h4>
            <a href="mailto:professionalconcerns@adanp.org">professionalconcerns@adanp.org</a>
            <p>For advocacy, policy, and professional issues.</p>
          </div>
        </div>
      </Section>

      {/* Officer Contact Info */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Board Members Contact</h2>
        </div>
        <div className="officer-contact-info">
          <p className="lead-text">
            To contact specific board members or national officers, please use
            the following email format:
          </p>
          <div className="email-format-box">
            <code>firstname.lastname@adanp.org</code>
          </div>
          <p className="example-text">
            Example: For President Maria Santos, email would be
            <code>maria.santos@adanp.org</code>
          </p>
          <p className="note-text">
            For general inquiries, please contact the secretariat first at
            <a href="mailto:secretariat@adanp.org"> secretariat@adanp.org</a>
          </p>
        </div>
      </Section>

      {/* Map Section Placeholder */}
      <Section variant="navy">
        <div className="section-header">
          <h2 className="section-title">Visit Us</h2>
          <p className="section-subtitle">
            ADANP National Office
          </p>
        </div>
        <div className="map-placeholder">
          <div className="map-content">
            <span className="map-icon"><FaMapMarkerAlt /></span>
            <h4>ADANP National Office</h4>
            <p>Philippines</p>
            <p className="hours">Office Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Contact;
