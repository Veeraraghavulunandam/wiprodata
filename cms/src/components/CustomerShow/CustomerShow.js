import React from 'react';

const CustomerShow = ({ customers }) => {
  return (
    <div>
      <h2>All Customers</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Password (Encrypted)</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{c.username}</td>
              <td>{c.email}</td>
              <td>{c.password}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerShow;
