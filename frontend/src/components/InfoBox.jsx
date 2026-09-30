import './InfoBox.css';

function InfoBox({ 
  icon,
  title, 
  children,
  variant = 'default'
}) {
  return (
    <div className={`info-box info-box-${variant}`}>
      {icon && <span className="info-box-icon">{icon}</span>}
      {title && <h4 className="info-box-title">{title}</h4>}
      <div className="info-box-content">{children}</div>
    </div>
  );
}

export default InfoBox;
