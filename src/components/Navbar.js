import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Ready Refrigerator</div>
      <ul className="navbar-links">
        <li><Link to="/recipes">Recipes</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/ai-assistant">AI Assistant</Link></li>
      </ul>
      <button className="navbar-signout">Sign out</button>
    </nav>
  );
}

export default Navbar;
