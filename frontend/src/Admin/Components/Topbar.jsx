import React from "react";
import "../CSS/Topbar.css";

function Topbar({ setIsOpen }) {

  return (
    <header className="topbar">

      {/* Mobile Menu */}
      <button
        className="mobile-menu"
        onClick={() => setIsOpen(true)}
      >
        ☰
      </button>


      <div className="topbar-space"></div>


      {/* Right Side */}
      <div className="topbar-right">

        {/* Help */}
        <button className="top-icon">
          ?
        </button>


        {/* Notification */}
        <button className="top-icon notification">
          ♟
          <span className="notification-dot"></span>
        </button>


        {/* Profile */}
        <div className="profile">

          <div className="avatar">
            SP
          </div>

          <div className="profile-text">

            <strong>
              Samaira Patel
            </strong>

            <span>
              Farmar
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;