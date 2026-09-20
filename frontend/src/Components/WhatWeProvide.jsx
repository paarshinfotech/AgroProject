
import ServiceCard from "./ServiceCard";
import "../CSS/WhatWeProvide.css";

const services = [
  {
    icon: "🌱",
    title: "Soil Related Solutions",
    description:
      "Get soil health insights, nutrient information and personalized recommendations to improve soil fertility and crop productivity.",
  },
  {
    icon: "🌾",
    title: "Seeds",
    description:
      "Explore quality seeds suitable for different crops and farming requirements from trusted agricultural suppliers.",
  },
  {
    icon: "🧪",
    title: "Fertilizers",
    description:
      "Find suitable fertilizers and nutrient solutions to support healthy crop growth and better yields.",
  },
  {
    icon: "🚜",
    title: "Farm Equipment",
    description:
      "Discover agricultural equipment and farming tools that make everyday farming activities easier and more efficient.",
  },
  {
    icon: "🛡️",
    title: "Pesticides",
    description:
      "Find suitable crop protection products to help manage pests and protect your crops effectively.",
  },
  {
    icon: "🌿",
    title: "Crop Disease Solutions",
    description:
      "Identify crop diseases using AI and get useful treatment recommendations and preventive measures.",
  },
  {
    icon: "📍",
    title: "Shop Locator",
    description:
      "Find nearby agricultural shops, dealers and service providers using your location.",
  },
  {
    icon: "☁️",
    title: "Weather Conditions",
    description:
      "Get weather updates, forecasts and alerts to make better decisions for your farming activities.",
  },
  {
    icon: "📦",
    title: "Order Management",
    description:
      "Track your orders, monitor deliveries and view your order history in one convenient place.",
    optional: true,
  },
];

function WhatWeProvide() {
  return (
    <section className="what-we-provide" id="services">
      <div className="container">
        {/* Section Heading */}
        <div className="services-heading text-center">
          <span className="services-label">WHAT WE PROVIDE</span>

          <h2>Our Services</h2>

          <p>
            Smart digital solutions designed to make farming easier, smarter and
            more productive.
          </p>

          <div className="heading-line">
            <span></span>
          </div>
        </div>

        {/* Cards */}
        <div className="row g-4 services-grid">
          {services.map((service, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <ServiceCard
                icon={service.icon}
                title={service.title}
                description={service.description}
                optional={service.optional}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhatWeProvide;
