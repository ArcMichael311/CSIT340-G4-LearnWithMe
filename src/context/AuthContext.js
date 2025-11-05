import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const AUTH_STORAGE_KEY = 'learnwithme2_auth_v1';
const USERS_STORAGE_KEY = 'learnwithme2_users_v1';

const defaultUsers = [
  { id: 1, username: 'demo', email: 'demo@example.com', password: 'demo123' }
];

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => {
    try {
      const raw = localStorage.getItem(USERS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultUsers;
    } catch (e) {
      console.error('Failed to parse users', e);
      return defaultUsers;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to persist users', e);
    }
  }, [users]);

  // Load current user from session on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (raw) {
        setCurrentUser(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to load current user', e);
    }
  }, []);

  const login = (usernameOrEmail, password) => {
    const user = users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return { success: true, user: userWithoutPassword };
    } else {
      return { success: false, error: 'Invalid username/email or password' };
    }
  };

  const register = (username, email, password) => {
    // Validate inputs
    if (!username.trim()) return { success: false, error: 'Username is required' };
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

    // Check if user already exists
    if (users.find(u => u.username === username || u.email === email)) {
      return { success: false, error: 'Username or email already exists' };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      username,
      email,
      password
    };

    setUsers([...users, newUser]);
    
    // Auto-login after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
