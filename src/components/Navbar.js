import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ user, onSignOut }) {
  return (
    <nav
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', color: '#333', margin: 0 }}>
          Ready Refrigerator
        </h1>
        <Link to="/recipes" style={{ textDecoration: 'none', color: '#333' }}>Recipes</Link>
        <Link to="/inventory" style={{ textDecoration: 'none', color: '#333' }}>Inventory</Link>
        <Link to="/ai-assistant" style={{ textDecoration: 'none', color: '#333' }}>AI Assistant</Link>
      </div>

      {user && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flex: '0 0 auto',
            width: '300px', 
          }}
        >
          <span
            style={{
              fontWeight: '500',
              color: '#333',
              whiteSpace: 'nowrap',
            }}
          >
            Hi, {user.displayName || user.email}
          </span>
          <button
            onClick={onSignOut}
            style={{
              marginLeft: 'auto', 
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              backgroundColor: '#f3f3f3',
              color: '#333',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
