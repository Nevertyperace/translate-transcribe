import React, { useState } from 'react';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8003/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    });
    if (response.ok) {
      const result = await response.json();
      setMessage('Login successful!');
    } else {
      const result = await response.json();
      setMessage(result.detail || 'Login failed');
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <label>Username:</label>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
    </div>
  );
};

export default LoginForm;
