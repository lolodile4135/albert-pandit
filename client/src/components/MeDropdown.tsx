import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './MeDropdown.css';

const MeDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleViewProfile = () => {
    navigate('/profile');
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="me-dropdown-container" ref={dropdownRef}>
      <button
        className="me-dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="me-icon">👤</span>
        <span className="me-text">Me</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="me-dropdown-menu">
          <div className="dropdown-header">
            <div className="dropdown-user-info">
              <div className="dropdown-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="dropdown-user-details">
                <div className="dropdown-user-name">{user?.name || 'User'}</div>
                <div className="dropdown-user-title">
                  Full-Stack Developer @Fasptix | Skilled in Typescript, ReactJs, NextJs, MySql, MongoDB, FastAPI, NodeJs, Azure DevOps | Building scalable applications
                </div>
              </div>
            </div>
            <button className="view-profile-btn" onClick={handleViewProfile}>
              View profile
            </button>
          </div>

          <div className="dropdown-section">
            <div className="dropdown-section-title">Account</div>
            <button className="dropdown-item">
              <span>Try 1 month of Premium for ₹0</span>
            </button>
            <button className="dropdown-item">
              <span>Settings & Privacy</span>
            </button>
            <button className="dropdown-item">
              <span>Help</span>
            </button>
            <button className="dropdown-item">
              <span>Language</span>
            </button>
          </div>

          <div className="dropdown-section">
            <div className="dropdown-section-title">Manage</div>
            <button className="dropdown-item">
              <span>Posts & Activity</span>
            </button>
            <button className="dropdown-item">
              <span>Job Posting Account</span>
            </button>
          </div>

          <div className="dropdown-footer">
            <button className="signout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeDropdown;

