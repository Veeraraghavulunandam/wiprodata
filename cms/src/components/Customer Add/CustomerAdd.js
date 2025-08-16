import React, { useState } from 'react';

const CustomerAdd = ({ onAdd }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const encryptedPassword = btoa(password); // simple encryption
    onAdd({ username, email, password: encryptedPassword });
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <h2>Create Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default CustomerAdd;