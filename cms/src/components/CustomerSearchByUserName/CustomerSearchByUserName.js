import React, { useState } from 'react';

const CustomerSearchByUserName = ({ customers }) => {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    const found = customers.find(c => c.username.toLowerCase() === username.toLowerCase());
    setResult(found || null);
  };

  return (
    <div>
      <h2>Search Customer By Username</h2>
      <input type="text" placeholder="Enter Username" value={username} onChange={e => setUsername(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {result ? <p>ID: {customers.indexOf(result) + 1}, Email: {result.email}, Password: {result.password}</p> : <p>No customer found</p>}
    </div>
  );
};

export default CustomerSearchByUserName;


