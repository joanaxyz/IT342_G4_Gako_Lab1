import React from 'react';
import '../styles/AuthLayout.css';
import logo from '../../assets/logo.png';

/**
 * AuthLayout - A reusable layout component for authentication pages.
 * 
 * @param {Object} props
 * @param {string} props.title - The title to display in the header
 * @param {string} [props.subtitle] - Optional subtitle for the header
 * @param {React.ReactNode} props.children - The content to render inside the card
 */
const AuthLayout = ({ title, subtitle, children }) => {
  
  return (
    <div className="auth-page-container">
      <div className="auth-left-panel">
        <div className="auth-brand">
          <img src={logo} alt="BrainBox Logo" className="auth-logo" />
          <h2 className="auth-brand-name">BrainBox</h2>
        </div>
        <p className="auth-description">
          BrainBox isn’t a notebook. It’s a place to offload memory, organize thought, and recall with clarity.
        </p>
      </div>
      <div className="auth-right-panel">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">{title}</h1>
            {subtitle && <p className="auth-subtitle">{subtitle}</p>}
          </header>
          <main className="auth-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
