import React, { useState } from 'react';

const CustomerSearchById = ({ customers }) => {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = () => {
    const index = parseInt(id) - 1;
    setResult(index >= 0 && index < customers.length ? customers[index] : null);
  };

  return (
    <div>
      <h2>Search Customer By ID</h2>
      <input type="number" placeholder="Enter ID" value={id} onChange={e => setId(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {result ? <p>Username: {result.username}, Email: {result.email}, Password: {result.password}</p> : <p>No customer found</p>}
    </div>
  );
};

export default CustomerSearchById;

