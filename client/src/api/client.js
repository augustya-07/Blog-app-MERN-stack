import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('inkspire_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function imageUrl(src) {
  if (!src) return 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80';
  if (src.startsWith('http')) return src;
  return `${UPLOADS_URL}${src}`;
}

export function getErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Something went wrong';
}
