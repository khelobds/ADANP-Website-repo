import Hero from '../components/Hero';
import Section from '../components/Section';
import './Policy.css';

function Policy() {
  return (
    <div className="policy">
      {/* Hero Section */}
      <Hero
        title="Policy & Advocacy"
        subtitle="Professional Standards"
        overlayColor="navy"
        backgroundImage="/policybg.png"
      />

      {/* Professional Concerns */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Professional Concerns</h2>
          <p className="section-body">
            ADANP believes that the thrust in achieving excellence in practice is through its professional standards.
            The organization is committed to assisting dermatology and aesthetic nurses in their roles as advanced
            nurse practitioners. This can be achieved by addressing current professional issues through dialogues
            and member engagements.
          </p>
          <p className="section-body">
            For further information, you may email us through{' '}
            <a href="mailto:professionalconcerns@adanp.org">professionalconcerns@adanp.org</a>
          </p>
        </div>
      </Section>

      {/* Positions */}
      <Section variant="light">
        <div className="section-header">
          <h2 className="section-title">Positions</h2>
          <p className="section-body">
            In the dynamic and fast paced world of the dermatology and aesthetic nursing practice, nurses are engaged
            to changes brought about by the health care delivery system of our country. ADANP plays a vital role in
            ensuring that the policies accord to the scope and standards of the organization.
          </p>
        </div>
      </Section>

      {/* Resolutions */}
      <Section variant="white">
        <div className="section-header">
          <h2 className="section-title">Resolutions</h2>
        </div>
      </Section>
    </div>
  );
}

export default Policy;