import React from 'react';
import './App.css';
import AuthForm from './AuthForm'; //added for firebase
import Inventory from './components/Inventory';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Inventory />
        {/* <AuthForm /> */}
    </div>
  );
}

export default App;
