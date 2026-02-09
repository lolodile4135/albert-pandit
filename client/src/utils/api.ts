// API configuration and utility functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = token;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.reload(); // This will trigger ProtectedRoute to show login
    }
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response;
};

// Interest API functions
export const interestAPI = {
  // Toggle interest (add/remove)
  toggleInterest: async (postId: string) => {
    const response = await apiRequest(`/interests/toggle/${postId}`, {
      method: 'POST',
    });
    return response.json();
  },

  // Get interest count
  getInterestCount: async (postId: string) => {
    const response = await apiRequest(`/interests/count/${postId}`, {
      method: 'GET',
    });
    return response.json();
  },

  // Check if user is interested
  checkUserInterest: async (postId: string) => {
    const response = await apiRequest(`/interests/check/${postId}`, {
      method: 'GET',
    });
    return response.json();
  },
};

// Auth API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  },
};

// Post API functions (for future use)
export const postAPI = {
  getPosts: async () => {
    const response = await apiRequest('/posts/get_my_posts', {
      method: 'GET',
    });
    return response.json();
  },
};

