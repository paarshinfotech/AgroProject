Navbar.jsx
import { useState } from "react";
import "../CSS/Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <a href="/" className="logo">
          <div className="logo-icon">
            <span className="leaf leaf-one"></span>
            <span className="leaf leaf-two"></span>
            <span className="leaf leaf-three"></span>
            <span className="stem"></span>
          </div>

          <div className="logo-text">
            <span>Nursery</span>
            <strong>Solution</strong>
          </div>
        </a>

        {/* Navigation */}
       <nav className={`nav ${open ? "nav-open" : ""}`}>

          <a href="/" className="nav-item active">
            Home
          </a>

          <div className="nav-dropdown">
            <button className="nav-item dropdown-btn">
              Solutions
              <span>⌄</span>
            </button>

            <div className="dropdown">
              <a href="/">Nursery Management</a>
              <a href="/">Plant Inventory</a>
              <a href="/">Sales Management</a>
            </div>
          </div>

         

          <a href="/" className="nav-item">
            About Us
          </a>

          <a href="/" className="login-btn">
            Login
          </a>

        </nav>

        {/* Mobile */}
        <button
          className="menu-btn"
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;