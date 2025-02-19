import React, { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [userSession, setUserSession] = useState(null);
  const [adminSession, setAdminSession] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userSession');
    const storedAdmin = localStorage.getItem('adminSession');

    if (storedUser) setUserSession(JSON.parse(storedUser));
    if (storedAdmin) setAdminSession(JSON.parse(storedAdmin));
  }, []);

  const setSession = (userData) => {
    if (userData.role === 'Admin') {
      setAdminSession(userData);
      localStorage.setItem('adminSession', JSON.stringify(userData)); // ✅ Store admin session
    } else {
      setUserSession(userData);
      localStorage.setItem('userSession', JSON.stringify(userData)); // ✅ Store user session
    }
  };

  const clearSession = () => {
    setUserSession(null);
    setAdminSession(null);
    localStorage.removeItem('userSession');
    localStorage.removeItem('adminSession');
  };

  return (
    <SessionContext.Provider value={{ userSession, adminSession, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
