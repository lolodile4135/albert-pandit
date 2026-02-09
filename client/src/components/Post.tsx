import React from 'react';
import InterestButton from './InterestButton';
import './Post.css';

interface PostProps {
  post: {
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
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-avatar">
          {post.owner?.profileImage ? (
            <img src={post.owner.profileImage} alt={post.owner.name} />
          ) : (
            <div className="post-avatar-placeholder">
              {post.owner?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="post-header-info">
          <div className="post-author-name">{post.owner?.name || 'Anonymous'}</div>
          {post.owner?.role && (
            <div className="post-author-role">{post.owner.role}</div>
          )}
          <div className="post-meta">
            <span className="post-time">{formatDate(post.createdAt)}</span>
            {post.city && <span className="post-location"> · {post.city}</span>}
          </div>
        </div>
      </div>

      <div className="post-content">
        {post.category && (
          <div className="post-category">{post.category}</div>
        )}
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>
      </div>

      <div className="post-actions">
        <InterestButton
          postId={post._id}
          initialCount={post.interestsCount || 0}
        />
        <button className="post-action-btn">
          <span className="action-icon">💬</span>
          <span>Comment</span>
        </button>
        <button className="post-action-btn">
          <span className="action-icon">↗️</span>
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default Post;

