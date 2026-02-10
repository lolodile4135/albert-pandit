import React, { useState } from 'react';
import InterestButton from './InterestButton';
import CommentsSection from './CommentsSection';
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
    relevanceScore?: number;
    scoreBreakdown?: {
      cityMatch: number;
      skillsOverlap: number;
      availability: number;
      investmentFit: number;
      profileCompleteness: number;
    };
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);

  // Safety check
  if (!post || !post._id) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recently';
    }
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
        <div className="post-header-meta">
          {post.category && (
            <div className="post-category">{post.category}</div>
          )}
          {post.relevanceScore !== undefined && post.relevanceScore !== null && !isNaN(post.relevanceScore) && (
            <div className="relevance-badge" title={`Relevance Score: ${Number(post.relevanceScore).toFixed(1)}/100`}>
              <span className="relevance-icon">⭐</span>
              <span className="relevance-score">{Number(post.relevanceScore).toFixed(0)}% Match</span>
            </div>
          )}
        </div>
        <h3 className="post-title">{post.title || 'Untitled Post'}</h3>
        <p className="post-description">{post.description || 'No description available'}</p>
      </div>

      <div className="post-actions">
        {post._id && (
          <InterestButton
            postId={post._id}
            initialCount={post.interestsCount || 0}
          />
        )}
        <button 
          className={`post-action-btn ${showComments ? 'active' : ''}`}
          onClick={() => setShowComments(!showComments)}
        >
          <span className="action-icon">💬</span>
          <span>Comment</span>
        </button>
        <button className="post-action-btn">
          <span className="action-icon">↗️</span>
          <span>Share</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && post._id && (
        <CommentsSection postId={post._id} />
      )}
    </div>
  );
};

export default Post;

