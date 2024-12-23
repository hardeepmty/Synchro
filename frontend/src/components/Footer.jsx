import React from 'react';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa'; // Import React Icons
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo and Tagline */}
        <div className="footer-logo-section">
          <h2 className="footer-logo">Synchro</h2>
          <p className="footer-tagline">Empowering Collaboration, Inspiring Innovation.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li>
              <a href="/about">About Us</a>
            </li>
            <li>
              <a href="/features">Features</a>
            </li>
            <li>
              <a href="/pricing">Pricing</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </div>

        {/* Social Media Links */}
        <div className="footer-social-section">
          <h3>Follow Us</h3>
          <div className="footer-social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={30} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={30} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub size={30} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Synchro. All Rights Reserved.</p>
        <p>
          Designed with ❤️ by <a href="https://hardeepportfolio.netlify.app/">Hardeep</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
