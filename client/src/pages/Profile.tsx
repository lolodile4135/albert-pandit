import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { postAPI } from '../utils/api';
import Post from '../components/Post';
import './Profile.css';

interface PostData {
  _id: string;
  title: string;
  description: string;
  owner?: {
    name: string;
    profileImage?: string;
    role?: string;
  };
  interestsCount?: number;
  createdAt?: string;
  category?: string;
  city?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const response = await postAPI.getPosts();
        if (response.success) {
          setPosts(response.my_posts || []);
        } else {
          setError(response.message || 'Failed to load posts');
        }
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-banner-large">
          <div className="banner-content">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
        <div className="profile-content">
          <div className="profile-avatar-large">
            <div className="avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
          <div className="profile-details">
            <h1 className="profile-name-large">{user?.name || 'User'}</h1>
            <p className="profile-title-large">
              Full-Stack Developer @Fasptix | Skilled in Typescript, ReactJs, NextJs, MySql, MongoDB, FastAPI, NodeJs, Azure DevOps | Building scalable applications
            </p>
            <p className="profile-location-large">📍 Proddatur, Andhra Pradesh</p>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-number">18</span>
                <span className="stat-label">Profile viewers</span>
              </div>
              <div className="profile-stat">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-posts-section">
        <h2 className="section-title">My Posts</h2>
        
        {loading && (
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading posts...</p>
          </div>
        )}

        {error && (
          <div className="profile-error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="profile-empty">
            <p>You haven't created any posts yet.</p>
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="profile-posts">
            {posts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

