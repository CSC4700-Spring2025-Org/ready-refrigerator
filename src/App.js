import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import AIAssistant from './components/AIAssistant';
// import AuthForm from './AuthForm'; // Uncomment if using

//updated function with routing for navbar links
function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* <AuthForm /> */}

        <Routes>
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
