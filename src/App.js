import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import './App.css';

import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import AIAssistant from './components/AIAssistant';
import AuthForm from './AuthForm';

function App() {
  const [user, setUser] = useState(null);
  const [redirectDone, setRedirectDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      if (currUser) {
        setUser(currUser);
        // Only redirect to /recipes once after login
        if (!redirectDone) {
          setRedirectDone(true);
          navigate('/recipes', { replace: true });
        }
      } else {
        setUser(null);
        // Reset the redirect flag upon sign-out
        setRedirectDone(false);
      }
    });
    return () => unsubscribe();
  }, [navigate, redirectDone]);

  const handleSignOut = () => {
    signOut(auth);
    // Reset redirect flag so that on next login, the redirect occurs again.
    setRedirectDone(false);
  };

  return (
    <div className="App">
      {user ? (
        <>
          <Navbar user={user} onSignOut={handleSignOut} />
          <AppRoutes />
        </>
      ) : (
        <AuthForm />
      )}
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Recipes />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
    </Routes>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
