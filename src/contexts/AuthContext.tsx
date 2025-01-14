import React, { createContext, useState, useContext, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial authentication status
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);

    // Listen for login/logout events
    const handleLoginStatusChange = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    window.addEventListener('loginStatusChanged', handleLoginStatusChange);
    window.addEventListener('storage', handleLoginStatusChange);

    return () => {
      window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
      window.removeEventListener('storage', handleLoginStatusChange);
    };
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('loginStatusChanged'));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
