import { FaBook, FaUserMd, FaUsers, FaChartBar, FaGraduationCap, FaGlobe, FaMicroscope, FaVideo, FaMobileAlt, FaBookOpen } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import Button from '../components/Button';
import './Education.css';

function Education() {
  return (
    <div className="education">
      {/* Hero Section */}
      <Hero
        title="Education & Training"
        subtitle="Continuous Learning"
        overlayColor="navy"
        backgroundImage="/educationbg.png"
      />

      {/* MSN Program */}
      <Section variant="white" id="msn">
        <div className="section-header">
          <h2 className="section-title">Master of Science in Nursing</h2>
          <p className="section-subtitle">
            Major in Dermatology and Aesthetic
          </p>
        </div>
        <div className="msn-content">
          <div className="msn-description">
            <p className="lead-text">
              This degree program is designed to develop professional nurses as a specialized role as a
              dermatology aesthetic nurse through advanced clinical practice, scientific endeavors and
              community development work using evidence-based skills.
            </p>
            <p>
              The curriculum aims to produce a fully functioning dermatology aesthetic nurse that is
              oriented with the adaptation of holistic skills and professional values adamant to the
              standards of the nursing profession. The dermatology aesthetic nurse must (1) develop a
              sensitive awareness of the needs of the target population as well as a commitment to the
              alleviation of accompanying problems that arises therefrom; (2) work within their
              professional standards and scope of practice based on each nurse's education, knowledge,
              competency, skills, attitude and extent of experience and lawful authority; and (3) be
              governed by evidence-based, training and research standard operating policy and procedures
              and clinical practice guidelines or its equivalent.
            </p>
          </div>
          <div className="msn-details">
            <InfoBox icon={<FaBook />} title="Program Details" variant="light">
              <ul>
                <li><strong>Degree:</strong> Master of Science in Nursing</li>
                <li><strong>Major:</strong> Dermatology and Aesthetic</li>
                <li><strong>Focus:</strong> Advanced Clinical Practice</li>
                <li><strong>Approach:</strong> Evidence-Based Skills</li>
              </ul>
            </InfoBox>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="learning-outcomes">
          <h3 className="outcome-title">Learning Outcomes</h3>
          <div className="outcomes-grid">
            <div className="outcome-item">
              <span className="outcome-icon"><FaMicroscope /></span>
              <h4>Clinical Assessment & Management</h4>
              <p>
                Apply specialist knowledge of anatomy and physiology to the nursing assessment
                and management of people undergoing dermatological treatments.
              </p>
            </div>
            <div className="outcome-item">
              <span className="outcome-icon"><FaUserMd /></span>
              <h4>Holistic Person-Centered Care</h4>
              <p>
                Analyze the principles of therapeutic treatments to apply to the delivery of
                holistic person-centered care.
              </p>
            </div>
            <div className="outcome-item">
              <span className="outcome-icon"><FaUsers /></span>
              <h4>Advanced Communication</h4>
              <p>
                Develop advanced communication skills in order to establish therapeutic
                relationships with patients, stakeholders and the multidisciplinary team.
              </p>
            </div>
            <div className="outcome-item">
              <span className="outcome-icon"><FaGraduationCap /></span>
              <h4>Leadership & Lifelong Learning</h4>
              <p>
                Critically reflect upon current practice and learning experiences to promote
                leadership, knowledge sharing and development of a philosophy of lifelong learning.
              </p>
            </div>
            <div className="outcome-item">
              <span className="outcome-icon"><FaGlobe /></span>
              <h4>Legal, Ethical & Cultural Awareness</h4>
              <p>
                Explore the legal, ethical and cultural issues in relation to the nursing care
                of patients undergoing dermatological procedures.
              </p>
            </div>
            <div className="outcome-item">
              <span className="outcome-icon"><FaChartBar /></span>
              <h4>Evidence-Based Contemporary Care</h4>
              <p>
                Critically analyze current literature and nursing practice to provide evidence-based
                contemporary care in the dermatology specialty.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CPD Programs */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Continuing Professional Development</h2>
          <p className="section-subtitle">
            Our monthly Continuing Professional Development Programs will ensure competency
            in your dermatology and aesthetic nursing practice.
          </p>
        </div>
        <div className="cpd-grid">

        </div>
      </Section>

      {/* Research & Development */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Research & Development</h2>
        </div>
        <div className="research-content">
          <div className="research-info">
            <InfoBox icon={<FaMicroscope />} title="Research Initiatives" variant="default">
              <p>
                Discover how ADANP nurses create, develop, and impact the professional
                values of the future.
              </p>
              <ul>

              </ul>
            </InfoBox>
          </div>
          <div className="research-journal">
            <h3>Journal</h3>
            <p>
              We present to you a digital library of scholarly journals that encompasses a
              spectrum of the most advanced and recent documents of the 21st century.
            </p>
          </div>
        </div>
      </Section>

      {/* Programs, Training & Seminars */}
      <Section variant="navy">
        <div className="section-header">
          <h2 className="section-title">Programs, Training and Seminars</h2>
          <p className="section-subtitle">
            Envision your future and be part of the growing community of learners.
          </p>
          <div className="text-center" style={{ marginTop: 'var(--spacing-xl)' }}>
            <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 'var(--spacing-md)' }}>
              ADANP adheres to its vision of producing qualified and competent dermatology aesthetic
              nurses locally and across the globe. We continue to develop programs, training and
              seminar-workshop programs that will enhance the professional standards of the advanced
              nurse practitioners in our country.
            </p>
          </div>

        </div>
        <div className="cert-exams-grid">

        </div>

      </Section>

      {/* Certification & Competency Examination */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Certification and Competency Examination</h2>
          <p className="section-subtitle">
            Validate your expertise with ADANP certifications
          </p>
        </div>
        <div className="certification-section">
          <div className="research-info">
            <InfoBox icon={<FaGraduationCap />} title="About the Examination" variant="default">
              <p>
                The National Certification and Competency Examination are administered by the
                Board of Examiners of the Association of Dermatology and Aesthetic Nurses of
                the Philippines to evaluate the competencies of entry-level dermatology and
                aesthetic nurses in the Philippines.
              </p>
              <p>
                The examinations cover topics from dermatology nursing principles to
                dermatology nursing clinical practices.
              </p>
            </InfoBox>
          </div>
        </div>
      </Section>

      {/* Resources */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Resources</h2>
          <p className="section-subtitle">
            Wide varieties of resources for the ADANP members are available for references and download.
          </p>
        </div>
        <div className="resources-grid">
          <InfoBox icon={<FaBookOpen />} title="Digital Library" variant="default">
            <p>
              Access our comprehensive digital library with textbooks, journals, guidelines,
              and clinical resources available exclusively for members.
            </p>
          </InfoBox>
          <InfoBox icon={<FaVideo />} title="Video Library" variant="default">
            <p>
              Watch procedural videos, lecture recordings, and demonstration videos
              from expert practitioners in dermatology and aesthetic nursing.
            </p>
          </InfoBox>
          <InfoBox icon={<FaMobileAlt />} title="Downloadable Materials" variant="default">
            <p>
              Download reference materials, clinical guidelines, research publications,
              and member resources directly from the ADANP portal.
            </p>
          </InfoBox>
        </div>
      </Section>
    </div>
  );
}

export default Education;