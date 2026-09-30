import './PersonCard.css';

function PersonCard({ name, title, image }) {
  return (
    <div className="person-card">
      {image ? (
        <div className="person-card-image-wrapper">
          <img src={image} alt={name} className="person-card-image" />
        </div>
      ) : (
        <div className="person-card-image-placeholder">
          <span className="person-card-initials">
            {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
      )}
      <div className="person-card-info">
        <h4 className="person-card-name">{name}</h4>
        <p className="person-card-title">{title}</p>
      </div>
    </div>
  );
}

export default PersonCard;
