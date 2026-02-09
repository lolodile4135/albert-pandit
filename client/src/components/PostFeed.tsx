import React, { useState, useEffect } from 'react';
import Post from './Post';
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
}

const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await postAPI.getPosts();
        // setPosts(response.my_posts || []);

        // Mock data for now
        const mockPosts: PostData[] = [
          {
            _id: '1',
            title: 'Looking for a Co-Founder for Food Delivery Startup',
            description: 'I have an innovative idea for a food delivery platform focusing on local restaurants. Looking for someone with marketing and operations experience.',
            owner: {
              name: 'John Doe',
              role: 'Idea Owner',
            },
            interestsCount: 5,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            category: 'FOOD',
            city: 'Mumbai',
          },
          {
            _id: '2',
            title: 'Tech Startup Seeking Technical Co-Founder',
            description: 'We are building a SaaS platform for small businesses. Need a full-stack developer with React and Node.js experience. Equity-based partnership.',
            owner: {
              name: 'Jane Smith',
              role: 'Business Developer',
            },
            interestsCount: 12,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            category: 'TECH',
            city: 'Bangalore',
          },
          {
            _id: '3',
            title: 'Retail Business Partnership Opportunity',
            description: 'Established retail business looking for an investor or partner to expand operations. Great location, proven track record.',
            owner: {
              name: 'Mike Johnson',
              role: 'Business Owner',
            },
            interestsCount: 3,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            category: 'RETAIL',
            city: 'Delhi',
          },
        ];

        setPosts(mockPosts);
        setError(null);
      } catch (err: any) {
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

  if (posts.length === 0) {
    return (
      <div className="post-feed-empty">
        <p>No posts available. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;

