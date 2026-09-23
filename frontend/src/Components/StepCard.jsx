import React from "react";

function StepCard({ step, icon, title, description }) {
  return (
    <div className="step-card">
      <div className="step-number">{step}</div>

      <div className="step-icon">
        <span>{icon}</span>
      </div>

      <h3>{title}</h3>

      <p>{description}</p>
    </div>
  );
}

export default StepCard;
