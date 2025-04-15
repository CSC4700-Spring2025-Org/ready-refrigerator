import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import './App.css';

import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import AIAssistant from './components/AIAssistant';
import AuthForm from './AuthForm';

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
  );
}

// Wrap the App component with Router so that useNavigate works correctly
export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

