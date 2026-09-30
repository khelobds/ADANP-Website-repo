import { FaBullseye, FaEye, FaStar, FaHandshake, FaScroll, FaGraduationCap, FaHeart, FaUsers, FaUserTie, FaBuilding, FaBook, FaGlobe, FaCertificate, FaComments } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import './About.css';

function About() {
  return (
    <div className="about">
      {/* Hero Section */}
      <Hero
        title="About Us"
        subtitle="Association of Dermatology and Aesthetic Nurses of the Philippines"
        overlayColor="navy"
        backgroundImage="/aboutbg.png"
      />

      {/* History Section */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">History</h2>
        </div>
        <div className="history-content text-content">
          <p>
            The first founding President, Raphael Victor Vera Cruz Santiago, armored the vision of
            providing a specialty-nursing practice in the Philippines. It was in the year 2015 that an
            informal meeting was held to discuss concerns regarding the establishment of an
            association for dermatology and aesthetic nurses. This meeting brought out a small but
            special association called, Philippine Association of Nurse Specialists for Aesthetics
            (PANSA).
          </p>
          <p>
            The following year, in July, 2016, the PANSA amended its name to Philippine Nurses
            Association for Aesthetic Practice (PNAAP). With this change, the now, PNAAP worked
            for its first batch of graduates of Certificate Program in Aesthetic Nursing held on July 3,
            2016 at Sulo Riviera Hotel. In regard to this achievement, on October, 2016, PNAAP was
            able to receive an approved application for Securities and Exchange Commission (SEC)
            Registration with an endorsement from the PRC Board of Nursing and was officially
            changed its association name to Association of Aesthetic Nurses of the Philippines
            (AANP).
          </p>
          <p>
            On December, 2017 the Association’s Nursing Career Progression and the Philippine
            Professional Nursing Practice Standards were presented at the Professional Regulation
            Commission-Board of Nursing. The increasing demand of mobility towards employment,
            skills enhancement, technical and continuing education have been pivotal principles in
            the development of the association.
          </p>
          <p>
            In 2018, AANP included the practice of Dermatology in its program and with this
            amendment, AANP gave birth to its new name, Association of Dermatologist and
            Aesthetic Nurses of the Philippines (ADANP). In addition, in December, 2018, ADANP
            held its first accredited PRC Continuing Professional Development seminar-workshop on
            Optimizing the Role of a Dermatology Aesthetic Nurse: An Introductory Course to
            Dermatology and Aesthetic Nursing Practice.
          </p>
          <p>
            With the increased clamor for the specialty program development, ADANP was awarded
            with a certificate as a Specialty Organization from PRC Board of Nursing for initially
            complying with the prescribed requirements for recognition. ADANP is also working for
            its new program, the Masters of Science in Nursing major in Dermatology and Aesthetic.
            The first ever annual convention was held on November 23, 2019 at the Club Filipino in
            San Juan City.
          </p>
          <p>
            From the informal meeting that once happened in 2015, ADANP today is taking pride as
            the noble work of the organization has been continuously persistent in the advancement
            of training and practice that entails directives in pursuing the standards of advanced nurse
            practitioners in dermatology and aesthetic.
          </p>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Mission & Vision</h2>
        </div>
        <div className="mv-grid">
          <div className="mv-card">
            <div className="mv-icon"><FaBullseye /></div>
            <h3>Mission</h3>
            <p>
              To lead the Filipino nurses in providing an advanced quality of care, through
              competency-based practice, in dermatology and aesthetic nursing.
            </p>
          </div>
          <div className="mv-card">
            <div className="mv-icon"><FaEye /></div>
            <h3>Vision</h3>
            <p>
              To empower and uplift Filipino nurse’s professional practice standards independently in
              providing patient care and safety in dermatology and aesthetic nursing.
            </p>
          </div>
        </div>
      </Section>

      {/* Core Values */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Core Values</h2>
        </div>
        <div className="values-list">
          <InfoBox icon={<FaStar />} title="Excellence">
            As the pioneer training organization for dermatology and aesthetic nursing, the Association of Dermatology and Aesthetic Nurses of the Philippines pursues, first and foremost, world-class quality education, training, research and is committed to the cultivation of excellent nurses, through competent clinical dermatology and aesthetic nurse practitioners and top-of-the-line methodologies.
          </InfoBox>
          <InfoBox icon={<FaHandshake />} title="Integrity">
            The Association of Dermatology and Aesthetic Nurses of the Philippines ensures its integrity through strong relationships with local and international organizations in providing and establishing the forefront of specialty program practice in the Philippines and the whole of Asia.
          </InfoBox>
          <InfoBox icon={<FaUserTie />} title="Professionalism">
            The Association of Dermatology Aesthetic Nurses of the Philippines is, in its essence, a professional organization, where the relationship between patient and the nurse provider is held to the highest standard.
          </InfoBox>
          <InfoBox icon={<FaGraduationCap />} title="Competency">
            The Association of Dermatology and Aesthetic Nurses of the Philippines ensures competency of its adbanced nurse practitioners through rigorous training and management education, in order to provide safe and quality care standards. The methodology of instruction of the Association of Dermatology and Aesthetic Nurses of the Philippines has been honed through years of scientific application, evidenced-based practice and evaluation by top-caliber educators, medical practitioners, and advanced nurse practitioners and has been proven, time and again, as overwhelmingly effective.
          </InfoBox>
          <InfoBox icon={<FaHeart />} title="Service">
            Committed to the growth of its members, the Association of Dermatology and Aesthetic Nurses of the Philippines ensures satisfaction through quality, patient-oriented service, which will cater to the individual needs of its patients.
          </InfoBox>
        </div>
      </Section>

      {/* Definitions Section */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Understanding Our Field</h2>
        </div>
        <div className="definitions-grid">
          <Card title="Dermatology Aesthetic Nursing" subtitle="Definition">
            <p>
              Dermatology Aesthetic Nursing is the art that seeks to understand and to recognize,
              through holistic and therapeutic approach, self-awareness of vital human skin conditions
              by promoting a degree of wellness that is geared towards improving quality of life,
              psychological wellbeing, and social function. Dermatology Aesthetic nursing aims to
              effectively communicate through patient education for desirable outcomes through
              internal and external perceptions by promoting positive self-talk.
            </p>
          </Card>
          <Card title="Dermatology Nurse" subtitle="Definition">
            <p>
              The Dermatology Nurse is an advanced nurse practitioner that addresses responsibility
              and accountability specializing in health promotion, prevention, assessment, diagnosis,
              and management of skin, hair, nails and its diseases.
            </p>
          </Card>
          <Card title="Dermatology Aesthetic Nurse" subtitle="Definition">
            <p>
              The Dermatology Aesthetic Nurse is an advanced nurse practitioner that has a
              subspecialty in dermatology nursing that is focused on managing, restoring and
              enhancing the skin through procedural dermatology, and aesthetic modalities that is
              meant to improve patient’s appearance rather than treat a disease.
            </p>
          </Card>
        </div>
      </Section>

      {/* Other Info Sections */}
      <Section variant="light">
        <div className="other-info-grid">

          <div className="info-block">
            <h3><FaBook className="inline-icon" /> Code of Ethics</h3>
            <p>
              <a href="#" className="pdf-link" target="_blank" rel="noopener noreferrer">Download PDF File</a>
            </p>
          </div>

          <div className="info-block">
            <h3><FaUsers className="inline-icon" /> Committee</h3>
            <ul className="committee-list">
              <li>Committee on Bylaws</li>
              <li>Reference Committee</li>
              <li>Ethics Committee</li>
              <li>Committee on Education and Professional Standards</li>
              <li>Committee on Research and Development</li>
              <li>Committee on Appropriations</li>
              <li>Committee on Membership</li>
              <li>Committee on Communications</li>
              <li>Nominations and Elections Committee</li>
            </ul>
          </div>

          <div className="info-block">
            <h3><FaBuilding className="inline-icon" /> Advanced Nurse Practitioners Society in Dermatology and Aesthetic</h3>
            <p>
              The Advanced Nurse Practitioners Society in Dermatology and Aesthetic is a specialty
              component of the Association of Dermatology and Aesthetic Nurses of the Philippines which is
              composed of certified advanced practitioners in dermatology and aesthetic nursing.
            </p>
          </div>

          <div className="info-block">
            <h3><FaCertificate className="inline-icon" /> Dermatology Nursing Board of Examiners</h3>
            <p>
              The Dermatology Nursing Board of Examiners administers the Certification and Competency
              Examination of the Association of Dermatology and Aesthetic Nurses of the Philippines. The
              Board ensures competency is applied in a core body of specialized knowledge, in dermatology
              and aesthetic nursing, aligning its principles on the scope of practice and professional nursing
              standards.
            </p>
          </div>

          <div className="info-block">
            <h3><FaHandshake className="inline-icon" /> Partnership and Affiliation</h3>
            <p>
              A unique partnership with the Association of Dermatology and Aesthetic Nurses of the
              Philippines provides a shared social responsibility in developing the professional standards
              destined by the opportunities and values which becomes an integral part of our vision and
              mission.
            </p>
            <p>To take pride of these advantages, you may reach us through <a href="mailto:partnership@adanp.org">partnership@adanp.org</a></p>
          </div>

          <div className="info-block">
            <h3><FaGlobe className="inline-icon" /> Regions</h3>
            <p>
              It is important to note that the different regions are established to provide connections within the
              local and national level. This will help facilitate networking and information-sharing among our
              groups and members. If you wish to be recognized, please reach the nearest chapter in your area.
            </p>
          </div>

          <div className="info-block" style={{ gridColumn: '1 / -1' }}>
            <h3><FaComments className="inline-icon" /> Testimonials</h3>
            <p>
              It is of value to learn about what our members have to say about the organization. Share your
              experience and be a source of inspiration.
            </p>
          </div>

        </div>
      </Section>
    </div>
  );
}

export default About;
