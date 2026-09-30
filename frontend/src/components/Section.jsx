import './Section.css';

function Section({
  children,
  variant = 'white',
  className = '',
  id
}) {
  return (
    <section 
      id={id}
      className={`section section-${variant} ${className}`.trim()}
    >
      <div className="container">
        {children}
      </div>
    </section>
  );
}

export default Section;
