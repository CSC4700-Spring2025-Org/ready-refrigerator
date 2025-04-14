import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // NEW
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Logged in!');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created!');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br />

        {/* Password input with toggle */}
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ paddingRight: '2.5rem' }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <br />
        <button type="submit">{isLogin ? 'Login' : 'Create Account'}</button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        {isLogin ? 'New here?' : 'Already have an account?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            color: 'blue',
            cursor: 'pointer'
          }}
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AuthForm;
