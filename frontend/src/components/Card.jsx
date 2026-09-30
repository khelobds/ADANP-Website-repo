import './Card.css';

function Card({ 
  children, 
  title, 
  subtitle,
  image,
  className = '',
  hoverEffect = true
}) {
  return (
    <div className={`card ${hoverEffect ? 'card-hover' : ''} ${className}`}>
      {image && (
        <div className="card-image-wrapper">
          <img src={image} alt={title || 'Card image'} className="card-image" />
        </div>
      )}
      {(title || subtitle) && (
        <div className="card-header">
          {subtitle && <span className="card-subtitle">{subtitle}</span>}
          {title && <h3 className="card-title">{title}</h3>}
        </div>
      )}
      {children && <div className="card-content">{children}</div>}
    </div>
  );
}

export default Card;
