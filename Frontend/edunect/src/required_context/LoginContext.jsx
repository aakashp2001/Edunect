import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const LoginContext = createContext();

// Create Provider Component
export function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // On component mount, check if there's data in sessionStorage
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const storedUserType = sessionStorage.getItem('userType');
    const storedUsername = sessionStorage.getItem('username');

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUsername(storedUsername);
    }
  }, []);
  
  const login = (type, user) => {
    setIsLoggedIn(true);
    setUserType(type);
    setUsername(user);
     // Store the data in sessionStorage
     sessionStorage.setItem('isLoggedIn', 'true');
     sessionStorage.setItem('userType', type);
     sessionStorage.setItem('username', user);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUsername('');

    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('username');
  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, userType, username, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}

// Custom Hook to use the LoginContext
export function useLogin() {
  return useContext(LoginContext);
}

