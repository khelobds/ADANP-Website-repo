import { Link } from 'react-router-dom';
import './Hero.css';

function Hero({ 
  title, 
  subtitle, 
  backgroundImage, 
  overlayColor = 'navy',
  children,
  primaryButton,
  secondaryButton 
}) {
  return (
    <section className={`hero hero-${overlayColor}`}>
      {backgroundImage && (
        <div 
          className="hero-background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        ></div>
      )}
      <div className="hero-overlay"></div>
      <div className="hero-content container">
        {subtitle && <p className="hero-subtitle fade-in">{subtitle}</p>}
        <h1 className="hero-title fade-in-delay-1">{title}</h1>
        {children && <div className="hero-text fade-in-delay-2">{children}</div>}
        {(primaryButton || secondaryButton) && (
          <div className="hero-buttons fade-in-delay-3">
            {primaryButton && (
              <Link 
                to={primaryButton.to} 
                className="btn btn-primary btn-large"
              >
                {primaryButton.text}
              </Link>
            )}
            {secondaryButton && (
              <Link 
                to={secondaryButton.to} 
                className="btn btn-outline btn-large"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
