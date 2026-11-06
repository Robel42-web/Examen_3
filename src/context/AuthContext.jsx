import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // El estado vive ÚNICAMENTE en la memoria RAM del navegador (React State)
  // No se utiliza localStorage ni sessionStorage
  const [userSession, setUserSession] = useState(null);

  const loginSession = (numeroControl, token = null) => {
    // Almacenamiento estrictamente en memoria volátil
    setUserSession({
      numeroControl,
      token,
    });
  };

  const logoutSession = () => {
    setUserSession(null);
  };

  return (
    <AuthContext.Provider value={{ userSession, loginSession, logoutSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};