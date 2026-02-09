import React, { useState, useEffect } from 'react';
import { interestAPI } from '../utils/api';
import './InterestButton.css';

interface InterestButtonProps {
  postId: string;
  initialCount?: number;
  initialIsInterested?: boolean;
  onToggle?: (isInterested: boolean, count: number) => void;
}

const InterestButton: React.FC<InterestButtonProps> = ({
  postId,
  initialCount = 0,
  initialIsInterested = false,
  onToggle,
}) => {
  const [isInterested, setIsInterested] = useState(initialIsInterested);
  const [count, setCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check user's interest status on mount
  useEffect(() => {
    const checkInterest = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsChecking(false);
          return;
        }

        const response = await interestAPI.checkUserInterest(postId);
        if (response.success) {
          setIsInterested(response.isInterested);
        }

        // Also fetch current count
        const countResponse = await interestAPI.getInterestCount(postId);
        if (countResponse.success) {
          setCount(countResponse.interestsCount);
        }
      } catch (error) {
        console.error('Error checking interest:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkInterest();
  }, [postId]);

  const handleToggle = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to show interest');
      return;
    }

    setIsLoading(true);
    try {
      const response = await interestAPI.toggleInterest(postId);
      if (response.success) {
        setIsInterested(response.isInterested);
        setCount(response.interestsCount);
        onToggle?.(response.isInterested, response.interestsCount);
      }
    } catch (error: any) {
      console.error('Error toggling interest:', error);
      alert(error.message || 'Failed to update interest');
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <button className="interest-btn interest-btn-loading" disabled>
        <span className="interest-icon">💡</span>
        <span>Loading...</span>
      </button>
    );
  }

  return (
    <button
      className={`interest-btn ${isInterested ? 'interest-btn-active' : ''}`}
      onClick={handleToggle}
      disabled={isLoading}
    >
      <span className="interest-icon">{isInterested ? '💡' : '💭'}</span>
      <span className="interest-text">
        {isInterested ? 'Interested' : 'Show Interest'}
      </span>
      {count > 0 && (
        <span className="interest-count">{count}</span>
      )}
    </button>
  );
};

export default InterestButton;

