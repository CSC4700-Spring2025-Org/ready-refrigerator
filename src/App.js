import React from 'react';
import './App.css';
import AuthForm from './AuthForm'; //added for firebase
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <p>
          Ready Refrigerator
        </p>

        <AuthForm />
      </header>
    </div>
  );
}

export default App;
