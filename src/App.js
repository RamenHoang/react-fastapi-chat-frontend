import React, { useState, useEffect } from "react";
import AuthForm from "./AuthForm";
import Main from "./Main";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [privateKey, setPrivateKey] = useState(localStorage.getItem('privateKey'));
  const [publicKey, setPublicKey] = useState(localStorage.getItem('publicKey'));

  useEffect(() => {
    if (accessToken && userId && privateKey && publicKey) {
      setIsAuthenticated(true);
    }
  }, [accessToken, userId, privateKey, publicKey]);

  const handleLoginSuccess = (token, userId, privateKey, publicKey) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('privateKey', privateKey);
    localStorage.setItem('publicKey', publicKey);
    setAccessToken(token);
    setUserId(userId);
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
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
  };

  return (
    <div>
      {isAuthenticated ? (
        <Main
          accessToken={accessToken}
          userId={userId}
          publicKeyPara={publicKey}
          privateKeyPara={privateKey}
          logout={logout}
        />
      ) : (
        <AuthForm onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;
