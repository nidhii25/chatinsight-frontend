// ===========================
// File: src/context/AuthContext.js
// ===========================

import React, { useState, useEffect } from 'react';

const API_BASE = 'https://chatinsight-backend.onrender.com';
const AuthContext = React.createContext();

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("User at start:", user);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.error('Failed to fetch user', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    const accessToken = data.access_token;

    localStorage.setItem('token', accessToken);
    setToken(accessToken);

    await fetchUser(accessToken);

    window.location.href = '/';
    return data;
  };

  const register = async (userData) => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
  const error = await res.json();

  let message = 'Registration failed';

  // Case 1: FastAPI returns list of validation errors
  if (Array.isArray(error.detail)) {
    message = error.detail.map((e) => e.msg).join(', ');
  }
  // Case 2: FastAPI returns a dict object
  else if (typeof error.detail === 'object') {
    message = JSON.stringify(error.detail);
  }
  // Case 3: Normal error string
  else if (typeof error.detail === 'string') {
    message = error.detail;
  }

  throw new Error(message);
}


    return await res.json();
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error('Backend logout failed:', err);
    }

    localStorage.removeItem('token');
    setToken(null);
    setUser(null);

    window.location.href = '/';
  };

  // 🔥🔥 THE PART THAT WAS MISSING
  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
