import { FaCheckCircle } from 'react-icons/fa';
import Hero from '../components/Hero';
import Section from '../components/Section';
import Button from '../components/Button';
import './Membership.css';

function Membership() {
  const membershipFees = [
    { type: 'Basic', fee: 'Php 600' },
    { type: 'Regular', fee: 'Php 1500' },
    { type: 'Life', fee: 'Php 5000' },
    { type: 'Associate', fee: 'Php 400' },
  ];

  const benefits = [
    "Display a certificate of membership/accreditation from ADANP",
    "Access to ADANP news journal",
    "Access to ADANP CPD programs, seminars and workshops",
    "Access to Philippine Professional Nursing Practice Standards for Dermatology and Aesthetic",
    "Educational Programs-Local and International",
    "Health Insurance Benefits",
    "Certification and Competency Examinations",
    "Awards, Scholarship and Grants",
    "Communication and Networking",
    "National Conventions",
    "Hold voting seats in the Membership Assembly",
    "Submit reference propositions, policies and bylaws amendments for consideration by ADANP",
    "Submit the names of nominees for ADANP elective and appointive positions in accordance with provisions of these bylaws and applicable policies of the republic",
    "A just trial among the regulating board before any disciplinary action is taken"
  ];

  return (
    <div className="membership">
      {/* Hero Section */}
      <Hero
        title="Membership"
        subtitle="Join the ADANP Community"
        overlayColor="navy"
        backgroundImage="/membershipbg.png"
      />

      {/* Membership Categories */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Membership Categories</h2>
        </div>
        <div className="membership-text-content">
          <p>
            ADANP shall be composed of organizations and individuals who have member or
            affiliate/associate status. Member status is granted to the organizations meeting the criteria of the
            consensus assembly of aesthetic practice. Affiliate status is available for organizations meeting
            the criteria for organizational affiliates. Both member and affiliate status are available for
            individuals.
          </p>
        </div>
      </Section>

      {/* Types of Membership */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Types of Membership</h2>
        </div>
        <div className="membership-types-container">
          <div className="membership-type-block">
            <h3>1) Individual Membership</h3>
            <ul className="membership-info-list">
              <li>
                <strong>1.1. Basic Membership</strong> is open to any licensed Registered Nurse currently practicing in
                the field of dermatology and aesthetic or has an interest in dermatology and
                aesthetic nursing practice;
              </li>
              <li>
                <strong>1.2. Regular Membership</strong> is conferred upon a registered nurse who has undergone the
                required post-graduate training program or its equivalent CPD and has paid the
                required fee for the current year;
              </li>
              <li>
                <strong>1.3. Life Membership</strong> is conferred upon a registered nurse who has undergone the
                required post-graduate training program or its equivalent CPD and has been a
                regular member for five (5) consecutive years and who shall have paid the
                required fees;
              </li>
              <li>
                <strong>1.4. Emeritus Membership</strong> is conferred upon registered nurse, who has rendered
                distinguished service to the Association in the attainment of its goals subject to the
                approval of the Board of Governors;
              </li>
              <li>
                <strong>1.5. Associate Membership</strong> is conferred upon associate health care professionals/allied
                health care individuals, and non-nursing/medicine practitioners who has taken
                equivalency training and upon compliance of requirements for membership.
              </li>
            </ul>
          </div>
          <div className="membership-type-block">
            <h3>2) Institutional Membership</h3>
            <p className="institutional-text">
              Is conferred upon compliance of requirements/training of the
              members and institutional board.
            </p>
          </div>
        </div>
      </Section>

      {/* Membership Benefits */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Membership Benefits</h2>
          <p className="membership-subtitle">Each individual member shall be entitled to -</p>
        </div>
        <div className="benefits-list-wrapper">
          <ul className="benefits-custom-list">
            {benefits.map((benefit, index) => (
              <li key={index}>
                <FaCheckCircle className="benefit-icon" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Membership Fees */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Membership Fees</h2>
        </div>
        <div className="fees-table-wrapper">
          <table className="custom-fees-table">
            <thead>
              <tr>
                <th>TYPE OF MEMBERSHIP</th>
                <th>ANNUAL FEE</th>
              </tr>
            </thead>
            <tbody>
              {membershipFees.map((fee, index) => (
                <tr key={index}>
                  <td>{fee.type}</td>
                  <td>{fee.fee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Become a member */}
      <Section variant="navy">
        <div className="section-header">
          <h2 className="section-title" style={{ color: 'var(--gold)' }}>Become a member</h2>
        </div>
        <div className="join-wrapper">
          <p className="join-message">
            When you join ADANP you become an integral part of the growing advanced nurse
            practitioners in dermatology and aesthetic providing safe, effective and competent patient
            care.
          </p>
          <div className="join-cta-group">
            <Button variant="primary" size="large">Join the ADANP online</Button>
            <Button variant="outline-light" size="large">Print an application form here</Button>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default Membership;

