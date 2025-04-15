import React, { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const fullName = `${firstName} ${lastName}`.trim();

        await updateProfile(user, {
          displayName: fullName,
        });

        alert('Account created!');
      }

      // Clear the form
      setEmail('');
      setPassword('');
      setFirstName('');
      setLastName('');
    } catch (err) {
      setError(err.message);
    }
  };

  const inputStyle = {
    width: '100%',
    maxWidth: '300px',
    padding: '0.75rem 1rem',
    borderRadius: '20px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const buttonStyle = {
    backgroundColor: '#cce7f6',
    padding: '0.5rem 1.5rem',
    borderRadius: '20px',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '0.5rem',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        {isLogin ? 'Login' : 'Sign Up'}
      </h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              style={inputStyle}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <div style={{ position: 'relative', maxWidth: '300px', margin: '0 auto' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ ...inputStyle, paddingRight: '2.5rem', marginBottom: 0 }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
              fontSize: '1.2rem',
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <button type="submit" style={buttonStyle}>
          {isLogin ? 'Login' : 'Create Account'}
        </button>
      </form>

      <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
        {isLogin ? 'New here?' : 'Already have an account?'}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFirstName('');
            setLastName('');
            setError('');
          }}
          style={{
            textDecoration: 'underline',
            background: 'none',
            border: 'none',
            color: 'blue',
            cursor: 'pointer',
            padding: 0,
            marginLeft: '0.3rem',
            fontSize: '0.95rem',
          }}
        >
          {isLogin ? 'Sign up' : 'Log in'}
        </button>
      </p>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
}

export default AuthForm;
