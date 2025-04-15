import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
>>>>>>> fbe792ad2b4d5db7941f7ee6fd6ed65fb911f0d2
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import './App.css';

import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import AIAssistant from './components/AIAssistant';
import AuthForm from './AuthForm';
<<<<<<< HEAD

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <Router>
      <div className="App">
        {user ? (
          <>
            <Navbar user={user} onSignOut={handleSignOut} />
            <Routes>
              <Route path="/" element={<Recipes />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
            </Routes>
          </>
        ) : (
          <AuthForm />
        )}
      </div>
    </Router>
=======

// Routes for authenticated users
function AppRoutes() {
  return (
    <Routes>
      {/* If necessary, you can still have "/" render Recipes */}
      <Route path="/" element={<Recipes />} />
      <Route path="/recipes" element={<Recipes />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  // Flag to track if we've already redirected after login
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
        // Optionally reset the redirect flag upon sign-out
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
>>>>>>> fbe792ad2b4d5db7941f7ee6fd6ed65fb911f0d2
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

