// src/config/api.js
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000'
  : 'https://backend-green-tau.vercel.app';

export default API_BASE_URL;