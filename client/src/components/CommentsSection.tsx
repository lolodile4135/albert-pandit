import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { commentAPI } from '../utils/api';
import './CommentsSection.css';

interface Comment {
  _id: string;
  text: string;
  user: {
    _id: string;
    name: string;
    profileImage?: string;
    role?: string;
  };
  createdAt: string;
}

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const INITIAL_COMMENTS_COUNT = 2;

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId]?.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await commentAPI.getComments(postId);
      if (response.success) {
        setComments(response.comments || []);
      }
    } catch (err: any) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (!user) {
      setError('Please login to comment');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await commentAPI.createComment(postId, commentText.trim());
      if (response.success) {
        setCommentText('');
        // Refresh comments
        await fetchComments();
        // Show all comments after adding new one
        setShowAll(true);
      } else {
        setError(response.message || 'Failed to add comment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    setOpenMenuId(null);
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await commentAPI.deleteComment(commentId);
      if (response.success) {
        // Remove comment from local state
        setComments(comments.filter(c => c._id !== commentId));
      } else {
        alert(response.message || 'Failed to delete comment');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete comment');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setOpenMenuId(null);
    setEditingCommentId(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editText.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await commentAPI.editComment(commentId, editText.trim());
      if (response.success) {
        // Update comment in local state
        setComments(comments.map(c => 
          c._id === commentId 
            ? { ...c, text: editText.trim() }
            : c
        ));
        setEditingCommentId(null);
        setEditText('');
      } else {
        setError(response.message || 'Failed to update comment');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update comment');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const displayedComments = showAll ? comments : comments.slice(0, INITIAL_COMMENTS_COUNT);
  const hasMoreComments = comments.length > INITIAL_COMMENTS_COUNT;

  return (
    <div className="comments-section">
      {/* Comment Input Form */}
      <form onSubmit={handleSubmitComment} className="comment-form">
        <div className="comment-input-wrapper">
          <div className="comment-avatar-small">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <input
            type="text"
            className="comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              setError(null);
            }}
            disabled={isSubmitting}
            maxLength={500}
          />
          <button
            type="submit"
            className="comment-submit-btn"
            disabled={isSubmitting || !commentText.trim()}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        {error && <div className="comment-error">{error}</div>}
      </form>

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="comments-loading">Loading comments...</div>
      ) : displayedComments.length === 0 ? (
        <div className="comments-empty">No comments yet. Be the first to comment!</div>
      ) : (
        <>
          <div className="comments-list">
            {displayedComments.map((comment) => {
              const isOwnComment = user && comment.user._id === user.id;
              const isEditing = editingCommentId === comment._id;
              
              return (
                <div key={comment._id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.user.profileImage ? (
                      <img src={comment.user.profileImage} alt={comment.user.name} />
                    ) : (
                      <div className="comment-avatar-placeholder">
                        {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <div className="comment-header-left">
                        <span className="comment-author">{comment.user.name}</span>
                        {comment.user.role && (
                          <span className="comment-author-role"> · {comment.user.role}</span>
                        )}
                        <span className="comment-time">{formatDate(comment.createdAt)}</span>
                      </div>
                      {isOwnComment && !isEditing && (
                        <div 
                          className="comment-menu-container"
                          ref={(el) => (menuRefs.current[comment._id] = el)}
                        >
                          <button
                            className="comment-menu-btn"
                            onClick={() => setOpenMenuId(openMenuId === comment._id ? null : comment._id)}
                            title="More options"
                          >
                            <span className="comment-menu-icon">⋯</span>
                          </button>
                          {openMenuId === comment._id && (
                            <div className="comment-menu-dropdown">
                              <button
                                className="comment-menu-item"
                                onClick={() => handleEditComment(comment)}
                              >
                                <span className="menu-item-icon">✏️</span>
                                Edit
                              </button>
                              <button
                                className="comment-menu-item delete"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                <span className="menu-item-icon">🗑️</span>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="comment-edit-form">
                        <textarea
                          className="comment-edit-input"
                          value={editText}
                          onChange={(e) => {
                            setEditText(e.target.value);
                            setError(null);
                          }}
                          rows={3}
                          maxLength={500}
                          autoFocus
                        />
                        <div className="comment-edit-actions">
                          <button
                            className="comment-edit-cancel"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                          <button
                            className="comment-edit-save"
                            onClick={() => handleSaveEdit(comment._id)}
                            disabled={!editText.trim()}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="comment-text">{comment.text}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMoreComments && !showAll && (
            <button
              className="load-more-comments-btn"
              onClick={() => setShowAll(true)}
            >
              Load more comments ({comments.length - INITIAL_COMMENTS_COUNT} more)
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default CommentsSection;

