import Hero from '../components/Hero';
import Section from '../components/Section';
import PersonCard from '../components/PersonCard';
import board from '../assets/board.png';
import './Board.css';

const nationalOfficers = [
  { id: 1, name: 'RAPHAEL VICTOR V. SANTIAGO, RN, LPT, M.A.Ed.', title: 'Founding President', image: null },
  { id: 2, name: 'MA. ANNA CECILIA L. PEREZ, RN', title: 'Vice President', image: null },
  { id: 3, name: 'DERLYN R. MACEDA, RN', title: 'Secretary', image: null },
  { id: 4, name: 'RALPH MARCO M. ALONZO, RN', title: 'Treasurer', image: null },
  { id: 5, name: 'MARIA KATRINA GRACE P. MEDINA, RN', title: 'Auditor', image: null },
];

const boardMembers = [
  { id: 1, name: 'ENRICO RAPHAEL Q. NACINO, RN,MAN', title: 'Board Member', image: null },
  { id: 2, name: 'LANCER FRANCE M. SERRANO, RN', title: 'Board Member', image: null },
  { id: 3, name: 'MARK JOSEPH D. SANTOS, RN, M.A.ED', title: 'Board Member', image: null },
];

function Board() {
  return (
    <div className="board">
      {/* Hero Section */}
      <Hero
        title="The Board"
        subtitle="National Leadership"
        overlayColor="navy"
        backgroundImage={board}
      />

      {/* National Officers */}
      <Section variant="white" id="officers">
        <div className="section-header">
          <h2 className="section-title">NATIONAL OFFICERS</h2>
          <p className="section-subtitle">
            Leading the vision of dermatology and aesthetic nursing in the Philippines
          </p>
        </div>
        <div className="board-grid">
          {nationalOfficers.map((officer) => (
            <PersonCard
              key={officer.id}
              name={officer.name}
              title={officer.title}
              image={officer.image}
            />
          ))}
        </div>
      </Section>

      {/* Board Members */}
      <Section variant="light" id="members">
        <div className="section-header">
          <h2 className="section-title">BOARD MEMBERS</h2>
          <p className="section-subtitle">
            Dedicated professionals supporting the organization's growth
          </p>
        </div>
        <div className="board-grid">
          {boardMembers.map((member) => (
            <PersonCard
              key={member.id}
              name={member.name}
              title={member.title}
              image={member.image}
            />
          ))}
        </div>
      </Section>

      {/* Contact CTA */}
      <Section variant="navy">
        <div className="board-cta text-center">
          <h3>Want to Connect with Our Board?</h3>
          <p>
            For official communications with board members, please contact us
            through our secretariat or use the officer email format:
          </p>
          <code className="email-format">firstname.lastname@adanp.org</code>
          <p className="contact-email">
            Or email us at: <a href="mailto:secretariat@adanp.org">secretariat@adanp.org</a>
          </p>
        </div>
      </Section>
    </div>
  );
}

export default Board;

