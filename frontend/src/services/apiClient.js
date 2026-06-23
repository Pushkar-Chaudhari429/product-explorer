import axios from 'axios';

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Clean trailing slashes first, then check if it ends with '/api' and append if missing
let cleanedUrl = rawUrl.trim().replace(/\/+$/, '');
if (!cleanedUrl.endsWith('/api')) {
  cleanedUrl = `${cleanedUrl}/api`;
}
const BASE_URL = cleanedUrl;

const api = axios.create({ baseURL: BASE_URL, timeout: 30000 });

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    const message = error.response?.data?.error?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export async function fetchProducts(params, signal) {
  const response = await api.get('/products', { params, signal });
  return response.data;
}
