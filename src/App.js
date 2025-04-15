import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
              <Route path="/" element={<Recipes />} /> {/* 👈 Default page */}
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
  );
}

export default App;



