// src/context/SessionContext.js

import React, { createContext, useState, useContext } from 'react';

const SessionContext = createContext();

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setSession = (user) => {
    setUser(user); // Set user session data
  };

  const clearSession = () => {
    setUser(null); // Clear session data
  };

  return (
    <SessionContext.Provider value={{ user, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};
