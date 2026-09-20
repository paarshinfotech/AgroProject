import React from "react";
import StepCard from "./StepCard";
import howWeWorkData from "../assets/HowWeWorkData";
import "../CSS/HowWeWork.css";

function HowWeWork() {
  return (
    <section className="how-we-work" id="how-we-work">
      <div className="container">
        {/* Section Heading */}
        <div className="how-heading text-center">
          <span className="how-label">HOW WE WORK</span>

          <h2>Simple Steps. Smarter Farming.</h2>

          <p>
            From identifying your farming needs to finding the right solution,
            we make every step easier.
          </p>

          <div className="heading-line">
            <span></span>
          </div>
        </div>

        {/* Steps */}
        <div className="row g-4 how-steps">
          {howWeWorkData.map((step, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <StepCard
                step={step.step}
                icon={step.icon}
                title={step.title}
                description={step.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowWeWork;
