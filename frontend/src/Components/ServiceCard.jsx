
function ServiceCard({ icon, title, description, optional = false }) {
  return (
    <div className="service-card">
      
      <div className="service-icon">
        <span>{icon}</span>
      </div>

     
      {optional && <span className="optional-badge">Optional</span>}

    
      <h3>{title}</h3>

     
      <p>{description}</p>

      
      <div className="service-arrow">→</div>
    </div>
  );
}

export default ServiceCard;
