import { createContext, useState } from 'react';

// Inizializzazione Context
const AuthContext = createContext(null);

const initializeUser = () => {
  const userString = localStorage.getItem('currentUser');
  return userString ? JSON.parse(userString) : null;
};

//  Componente AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initializeUser);
  const isLoggedIn = !!user;

  // Funzione per il Login
  const login = (userData) => {
    // da modificare per token
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  // Funzione per il Logout
  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  // L'oggetto che sarà accessibile tramite useAuth()
  const value = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
