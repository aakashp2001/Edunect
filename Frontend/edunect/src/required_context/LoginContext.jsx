import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const LoginContext = createContext();

// Create Provider Component
export function LoginProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [firstTime,setFirstTime] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // On component mount, check if there's data in sessionStorage
    const storedIsLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const storedFirstTime = sessionStorage.getItem('firstTime');
    const storedUserType = sessionStorage.getItem('userType');
    const storedUsername = sessionStorage.getItem('username');

    if (storedIsLoggedIn) {
      setIsLoggedIn(true);
      setFirstTime(storedFirstTime);
      setUserType(storedUserType);
      setUsername(storedUsername);
    }
  }, []);
  
  const login = (type, user,first_time) => {
    setIsLoggedIn(true);
    setUserType(type);
    setFirstTime(first_time)
    setUsername(user);
     // Store the data in sessionStorage
     sessionStorage.setItem('isLoggedIn', 'true');
     sessionStorage.setItem('userType', type);
     sessionStorage.setItem('firstTime',first_time);
     sessionStorage.setItem('username', user);
  };

  const updateFirstTime = (first_time) =>{
    setFirstTime(first_time);
    sessionStorage.setItem('firstTime',first_time);
  }

  const logout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    setUsername('');
    setFirstTime(false);

    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('firstTime');

  };

  return (
    <LoginContext.Provider value={{ isLoggedIn, userType, username, firstTime,login, logout, updateFirstTime }}>
      {children}
    </LoginContext.Provider>
  );
}

// Custom Hook to use the LoginContext
export function useLogin() {
  return useContext(LoginContext);
}

