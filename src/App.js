import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import AuthForm from "./AuthForm";
import Main from "./Main";
import ListUsers from "./ListUsers";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [privateKey, setPrivateKey] = useState(localStorage.getItem('privateKey'));
  const [publicKey, setPublicKey] = useState(localStorage.getItem('publicKey'));

  useEffect(() => {
    if (accessToken && userId && role && privateKey && publicKey) {
      setIsAuthenticated(true);
    }
  }, [accessToken, userId, role, privateKey, publicKey]);

  const handleLoginSuccess = (token, userId, privateKey, publicKey, role) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('privateKey', privateKey);
    localStorage.setItem('publicKey', publicKey);
    localStorage.setItem('role', role);
    setAccessToken(token);
    setUserId(userId);
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    setRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('privateKey');
    localStorage.removeItem('publicKey');
    setIsAuthenticated(false);
    setUserId(null);
    setAccessToken(null);
    setPrivateKey(null);
    setPublicKey(null);

    window.location.href = '/';
  };

  return isAuthenticated ? (
    <Router>
      <Routes>
        <Route path="/" element={<Main
          accessToken={accessToken}
          userId={parseInt(userId, 10)}
          publicKeyPara={publicKey}
          privateKeyPara={privateKey}
          logout={logout}
          role={role}
        />} />
        <Route path="/list-users" element={<ListUsers
          accessToken={accessToken}
          userId={parseInt(userId, 10)}
          logout={logout}
          role={role}
          />} />
      </Routes>
      <ToastContainer /> {/* Toast container */}
    </Router>
  ) : (
    <Router>
      <AuthForm onLoginSuccess={handleLoginSuccess} />
      <ToastContainer /> {/* Toast container */}
    </Router>
  );
};

export default App;
