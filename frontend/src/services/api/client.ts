// Axios instance so we can swap baseURL/env behavior in one place.
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

export default api;
