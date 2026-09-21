import { useState } from "react";
import "../CSS/sidebar.css";

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    label: "Customer Management",
    path: "/customers",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.7-3 2.6-4.5 5.5-4.5s4.8 1.5 5.5 4.5" />
        <path d="M16 11a3 3 0 1 0 0-6" />
        <path d="M17 14.5c2 .4 3.2 1.8 3.7 4" />
      </svg>
    ),
  },
  {
    label: "Vendor Management",
    path: "/vendors",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 10h16" />
        <path d="M5 10v9h14v-9" />
        <path d="M3 10l2-5h14l2 5" />
        <path d="M8 19v-5h8v5" />
      </svg>
    ),
  },
  {
    label: "Approval Management",
    path: "/approvals",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="m8 12 2.2 2.2L16 8.5" />
      </svg>
    ),
  },
  {
    label: "Admin Role Management",
    path: "/admin-roles",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="8" r="3" />
        <path d="M5 20c.8-3.4 3.1-5 7-5s6.2 1.6 7 5" />
        <path d="M19 5v3" />
        <path d="M17.5 6.5h3" />
      </svg>
    ),
  },
  {
    label: "Subscription Management",
    path: "/subscriptions",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 9h18" />
        <path d="M7 14h4" />
      </svg>
    ),
  },
  {
    label: "Reports",
    path: "/reports",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 19V9" />
        <path d="M12 19V5" />
        <path d="M19 19v-7" />
      </svg>
    ),
  },
  {
    label: "Push Notification",
    path: "/notifications",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8" />
        <path d="M10 21h4" />
      </svg>
    ),
  },
];

function Sidebar({ setCurrentPage }) {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const handleItemClick = (label) => {
    setActiveItem(label);
    setCurrentPage(label);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1>AgriAdmin</h1>
      </div>

      <nav className="sidebar__nav" aria-label="Admin navigation">
        {menuItems.map((item) => {
          const isActive = activeItem === item.label;

          return (
            <button
              key={item.label}
              type="button"
              className={`sidebar__item ${
                isActive ? "sidebar__item--active" : ""
              }`}
              onClick={() => handleItemClick(item.label)}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="sidebar__icon">{item.icon}</span>

              <span className="sidebar__label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}



export default Sidebar;

