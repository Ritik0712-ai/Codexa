import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['x-user-id'] = token;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
};

// User API
export const userAPI = {
  getMe: () => api.get('/users/me'),
  updateMe: (data: { name?: string; avatarUrl?: string }) =>
    api.put('/users/me', data),
  getStats: () => api.get('/users/stats'),
};

// Review API
export const reviewAPI = {
  createSnippetReview: (data: { code: string; language: string }) =>
    api.post('/reviews/snippet', data),
  createFileReview: (data: { fileId: string; language: string }) =>
    api.post('/reviews/upload', data),
  getReviews: (params?: { page?: number; limit?: number; search?: string; status?: string }) =>
    api.get('/reviews', { params }),
  getReview: (id: string) => api.get(`/reviews/${id}`),
  deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Review {
  id: string;
  sourceType: 'SNIPPET' | 'FILE';
  language: string;
  overallScore: number;
  summary: string;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  metrics?: ReviewMetric;
  findings?: ReviewFinding[];
  _count?: { findings: number };
}

export interface ReviewFinding {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  issue: string;
  explanation: string;
  suggestedFix?: string;
  fileName?: string;
  lineNumber?: number;
}

export interface ReviewMetric {
  linesOfCode: number;
  functions: number;
  classes: number;
  cyclomaticComplexity: number;
  fileComplexity: number;
}

export interface UserStats {
  totalReviews: number;
  avgScore: number;
  reviewsByLanguage: { language: string; count: number }[];
  recentActivity: { id: string; language: string; overallScore: number; status: string; createdAt: string }[];
}

export default api;
