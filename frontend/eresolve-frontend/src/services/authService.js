// src/services/auth.js
import api from './api';

export const login = (credentials) => 
  api.post('/api/auth/login', credentials);

export const register = (data) => 
  api.post('/api/auth/register', data);