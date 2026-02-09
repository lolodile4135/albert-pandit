import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './LeftSidebar.css';

const LeftSidebar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate('/profile');
  };

  return (
    <aside className="left-sidebar">
      <div className="sidebar-profile-card">
        <div className="profile-banner">
          <div className="profile-banner-content">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{user?.name || 'User'}</h3>
          <p className="profile-title">Full-Stack Developer</p>
          <p className="profile-location">📍 Proddatur, Andhra Pradesh</p>
          <button className="add-experience-btn" onClick={handleViewProfile}>
            + Experience
          </button>
        </div>
      </div>

      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-label">Profile viewers</span>
          <span className="stat-value">18</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Post impressions</span>
          <span className="stat-value">2</span>
        </div>
      </div>

      <div className="sidebar-premium">
        <div className="premium-content">
          <p className="premium-title">Get hired up to 2.7x faster with Premium</p>
          <button className="premium-btn">Try for ₹0</button>
        </div>
      </div>

      <div className="sidebar-links">
        <button className="sidebar-link">
          <span className="link-icon">🔖</span>
          <span>Saved items</span>
        </button>
        <button className="sidebar-link">
          <span className="link-icon">👥</span>
          <span>Groups</span>
        </button>
        <button className="sidebar-link">
          <span className="link-icon">📰</span>
          <span>Newsletters</span>
        </button>
        <button className="sidebar-link">
          <span className="link-icon">📅</span>
          <span>Events</span>
        </button>
      </div>
    </aside>
  );
};

export default LeftSidebar;

