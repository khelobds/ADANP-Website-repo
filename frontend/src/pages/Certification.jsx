import Hero from '../components/Hero';
import Section from '../components/Section';
import Card from '../components/Card';
import InfoBox from '../components/InfoBox';
import Table from '../components/Table';
import Button from '../components/Button';
import './Certification.css';

const examSchedule = [
  { exam: 'Certified Aesthetic Nurse (CAN)', date: 'June 15, 2026', venue: 'Manila' },
  { exam: 'Dermatology Nurse Practitioner (DNP)', date: 'September 20, 2026', venue: 'Cebu' },
  { exam: 'Fellowship Exam (FADANP)', date: 'November 10, 2026', venue: 'Davao' },
];

const passersData = [
  { name: 'Juan Dela Cruz', certification: 'CAN', year: '2025' },
  { name: 'Maria Santos', certification: 'CAN', year: '2025' },
  { name: 'Pedro Reyes', certification: 'DNP', year: '2025' },
  { name: 'Ana Garcia', certification: 'FADANP', year: '2025' },
];

function Certification() {
  const columns = [
    { header: 'Name', accessor: 'name' },
    { header: 'Certification', accessor: 'certification' },
    { header: 'Year', accessor: 'year' },
  ];

  return (
    <div className="certification">
      {/* Hero Section */}
      <Hero
        title="Certification & Competency"
        subtitle="Professional Development"
        overlayColor="navy"
        backgroundImage="/certificatebg.png"
      />

      {/* Programs Overview */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Our Certification Programs</h2>
          <p className="section-subtitle">
            Advance your career with our comprehensive certification programs
          </p>
        </div>

        <div className="programs-grid">
          {/* CAN Program */}
          <Card
            id="can"
            title="Certified Aesthetic Nurse (CAN)"
            subtitle="Entry Level Certification"
          >
            <p>
              The CAN certification is designed for registered nurses who wish to
              specialize in aesthetic nursing procedures. This program covers fundamental
              knowledge and skills in cosmetic dermatology.
            </p>
            <ul className="program-requirements">
              <li><strong>Duration:</strong> 6 months</li>
              <li><strong>Requirements:</strong> Active RN license, 1 year clinical experience</li>
              <li><strong>Curriculum:</strong> Basic aesthetic procedures, patient assessment, safety protocols</li>
            </ul>
            <div className="program-actions">
              <Button variant="primary" size="small">Application Form</Button>
              <Button variant="outline-navy" size="small">Candidate Bulletin</Button>
            </div>
          </Card>

          {/* DNP Program */}
          <Card
            id="dnp"
            title="Dermatology Nurse Practitioner (DNP)"
            subtitle="Advanced Certification"
          >
            <p>
              The DNP certification prepares experienced nurses for advanced practice
              in dermatology. This comprehensive program includes both medical and
              surgical dermatology training.
            </p>
            <ul className="program-requirements">
              <li><strong>Duration:</strong> 12 months</li>
              <li><strong>Requirements:</strong> CAN certification, 2 years dermatology experience</li>
              <li><strong>Curriculum:</strong> Advanced dermatology, laser therapy, surgical assistance</li>
            </ul>
            <div className="program-actions">
              <Button variant="primary" size="small">Application Form</Button>
              <Button variant="outline-navy" size="small">Candidate Bulletin</Button>
            </div>
          </Card>

          {/* Fellowship Program */}
          <Card
            id="fadanp"
            title="Fellowship Program (FADANP)"
            subtitle="Highest Level of Expertise"
          >
            <p>
              The FADANP fellowship is the pinnacle of dermatology and aesthetic
              nursing education. Fellows gain expertise in complex procedures and
              contribute to research and education.
            </p>
            <ul className="program-requirements">
              <li><strong>Duration:</strong> 24 months</li>
              <li><strong>Requirements:</strong> DNP certification, 5 years experience</li>
              <li><strong>Curriculum:</strong> Advanced injectables, research methodology, teaching</li>
            </ul>
            <div className="program-actions">
              <Button variant="primary" size="small">Application Form</Button>
              <Button variant="outline-navy" size="small">Candidate Bulletin</Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* Application Section */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Submit Your Application</h2>
        </div>
        <div className="application-info">
          <InfoBox
            icon="📋"
            title="Application Process"
            variant="default"
          >
            <ol className="application-steps">
              <li>Complete the application form for your chosen certification program</li>
              <li>Gather required documents (RN license, transcripts, certificates)</li>
              <li>Submit application with payment of examination fees</li>
              <li>Receive confirmation and examination schedule</li>
              <li>Complete review course (recommended)</li>
              <li>Take the certification examination</li>
            </ol>
          </InfoBox>
          <div className="application-cta">
            <h4>Ready to Apply?</h4>
            <p>
              Download the application forms and candidate bulletins, or contact
              our certification department for assistance.
            </p>
            <div className="cta-buttons">
              <Button variant="primary" size="large">Download Forms</Button>
              <Button variant="outline-navy" size="large">Contact Us</Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Exam Schedule */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Schedule of Examinations</h2>
          <p className="section-subtitle">
            2026 Certification Exam Dates
          </p>
        </div>
        <Table
          columns={[
            { header: 'Examination', accessor: 'exam' },
            { header: 'Date', accessor: 'date' },
            { header: 'Venue', accessor: 'venue' },
          ]}
          data={examSchedule}
          className="exam-schedule-table"
        />
      </Section>

      {/* List of Passers */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Recent Passers</h2>
          <p className="section-subtitle">
            Congratulations to our newly certified members
          </p>
        </div>
        <Table
          columns={columns}
          data={passersData}
          className="passers-table"
        />
        <p className="table-note">
          * This is a partial list. For the complete list of passers, please contact
          the certification department.
        </p>
      </Section>
    </div>
  );
}

export default Certification;
