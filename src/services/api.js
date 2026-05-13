import axios from 'axios';
import { normalizeApiBaseUrl } from '../utils/apiBaseUrl';

const RENDER_API_URL = 'https://portal-b-qhir.onrender.com';

// In dev, prefer Vite's `/api` proxy (baseURL empty).
// In production, fall back to the Render API if Vercel env var isn't set.
const baseFromEnv = normalizeApiBaseUrl(import.meta.env.VITE_API_URL || '');
const baseURL =
  baseFromEnv || (import.meta.env.PROD ? RENDER_API_URL : '');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   
  withCredentials: true,                   
});

export default api;