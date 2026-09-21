import "../CSS/Sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {

  const menuItems = [
    { icon: "▦", name: "Dashboard" },
    { icon: "▣", name: "Customer Management" },
    { icon: "⚒️", name: "Vendor Management" },
    { icon: "▧", name: "Approval Management" },
    { icon: "▤", name: "Admin Roles" },
    { icon: "▣", name: "Offers & Coupon" },
    { icon: "▱", name: "Subscription Management" },
    { icon: "▥", name: "Reports" },
    { icon: "🔔", name: "Push Notification" }
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>

      {/* Logo */}
      <div className="brand-row">

        <button
          className="menu-toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {isOpen && (
          <h2>Agrostar</h2>
        )}

      </div>

      {/* Menu */}
      <nav className="menu">

        {menuItems.map((item, index) => (

          <button
            key={item.name}
            className={`menu-item ${
              index === 0 ? "active" : ""
            }`}
          >

            <span className="menu-icon">
              {item.icon}
            </span>

            {isOpen && (
              <span className="menu-text">
                {item.name}
              </span>
            )}

          </button>

        ))}

      </nav>

      {/* Logout */}
      <button className="logout">

        <span className="logout-icon">
          ⇥
        </span>

        {isOpen && (
          <span>
            Profile logout
          </span>
        )}

      </button>

    </aside>
  );
}

export default Sidebar;