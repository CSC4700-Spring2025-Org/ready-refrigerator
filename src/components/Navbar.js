import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">Ready Refrigerator</div>
      <ul className="navbar-links">
        <li>Recipes</li>
        <li>Inventory</li>
        <li>AI Assistant</li>
      </ul>
      <button className="navbar-signout">Sign out</button>
    </nav>
  );
}

export default Navbar;