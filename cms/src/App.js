import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import CustomerAdd from './components/CustomerAdd';
import CustomerShow from './components/CustomerShow';
import CustomerSearchById from './components/CustomerSearchById';
import CustomerSearchByUserName from './components/CustomerSearchByUserName';
import CustomerAuthentication from './components/CustomerAuthentication';
import './App.css';

function App() {
  const [customers, setCustomers] = useState([]);

  return (
    <BrowserRouter>
      <div>
        <nav style={{ marginBottom: '20px' }}>
          <NavLink to="/" style={{ marginRight: '10px' }}>Add Customer</NavLink>
          <NavLink to="/show" style={{ marginRight: '10px' }}>Show Customers</NavLink>
          <NavLink to="/searchid" style={{ marginRight: '10px' }}>Search By ID</NavLink>
          <NavLink to="/searchuser" style={{ marginRight: '10px' }}>Search By Username</NavLink>
          <NavLink to="/auth" style={{ marginRight: '10px' }}>Login</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<CustomerAdd onAdd={c => setCustomers([...customers, c])} />} />
          <Route path="/show" element={<CustomerShow customers={customers} />} />
          <Route path="/searchid" element={<CustomerSearchById customers={customers} />} />
          <Route path="/searchuser" element={<CustomerSearchByUserName customers={customers} />} />
          <Route path="/auth" element={<CustomerAuthentication customers={customers} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
