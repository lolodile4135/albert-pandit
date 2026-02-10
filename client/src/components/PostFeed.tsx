import React, { useState, useEffect } from 'react';
import Post from './Post';
import CreatePostModal from './CreatePostModal';
import { postAPI } from '../utils/api';
import './PostFeed.css';

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
  relevanceScore?: number;
  scoreBreakdown?: {
    cityMatch: number;
    skillsOverlap: number;
    availability: number;
    investmentFit: number;
    profileCompleteness: number;
  };
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postAPI.getRelevantPosts();
        
        if (response.success) {
          setPosts(response.posts || []);
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

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="post-feed-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-feed-error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const handleCreateSuccess = () => {
    // Refresh posts after successful creation
    window.location.reload(); // Simple reload for now, can be optimized later
  };

  if (posts.length === 0) {
    return (
      <>
        <div className="post-feed">
          <div className="post-feed-header">
            <h2>Opportunities</h2>
            <button className="create-post-btn" onClick={() => setIsModalOpen(true)}>
              <span className="btn-icon">+</span>
              Create Post
            </button>
          </div>
          <div className="post-feed-empty">
            <p>No posts available. Be the first to create one!</p>
          </div>
        </div>
        <CreatePostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      </>
    );
  }

  return (
    <>
      <div className="post-feed">
        <div className="post-feed-header">
          <h2>Opportunities</h2>
          <button className="create-post-btn" onClick={() => setIsModalOpen(true)}>
            <span className="btn-icon">+</span>
            Create Post
          </button>
        </div>
        {posts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default PostFeed;

