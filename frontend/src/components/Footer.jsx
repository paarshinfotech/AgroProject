import React from 'react';
import { FaInstagram, FaWhatsapp, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';
import "../CSS/Footer.css"

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand Section */}
        <div className="footer-col">
          {/* <h2 className="footer-logo">AgroProject</h2> */}

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
        
          <p className="brand-desc">
            Your trusted agricultural partner. Empowering farmers with modern technology, real-time insights, and smart farming solutions.
          </p>
          
          {/* Social Media Icons */}
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="icon-link">
              <FaInstagram />
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="icon-link">
              <FaWhatsapp />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="icon-link">
              <FaLinkedinIn />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="icon-link">
              <FaFacebookF />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-title">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        {/* Agro Services */}
        <div className="footer-col">
          <h4 className="footer-title">Agro Services</h4>
          <ul className="footer-links">
            <li><a href="#weather">Weather Forecast</a></li>
            <li><a href="#crops">Crop Advisory</a></li>
            <li><a href="#market">Market Rates</a></li>
            <li><a href="#products">Agri Products</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-col">
          <h4 className="footer-title">Contact Us</h4>
          <div className="contact-card">
            <p>📍 Maharashtra, India</p>
            <p>📞 +91 98765 43210</p>
            <p>✉️ support@agroproject.com</p>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2026 Nursery Solution. All rights reserved.</p>
        <div className="bottom-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;