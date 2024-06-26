// Login.js
import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [userId, setUserId] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onLogin(userId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="userId">User ID:</label>
      <input
        type="text"
        id="userId"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
