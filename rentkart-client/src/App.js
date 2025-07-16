import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import Orders from "./pages/Orders";
import OwnerOrders from "./pages/OwnerOrders";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} /> 
        <Route path="/orders" element={<Orders />} />
        <Route path="/owner-orders" element={<OwnerOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
