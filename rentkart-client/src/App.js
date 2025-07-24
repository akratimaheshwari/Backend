// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Home from './pages/Home';
// import UserDashboard from './pages/UserDashboard';
// import Orders from "./pages/Orders";
// import Items from "./pages/Items";
// import CategoryItems from './pages/CategoryItems';
// import ItemsDetails from "./pages/ItemsDetails";
// import Cart from "./pages/Cart";
// import MyListing from "./pages/MyListing";
// import AddItems from "./pages/AddItems";
// import Checkout from "./pages/Checkout";
// import ProfilePage from './pages/ProfilePage'; // or wherever the file is
// import ChangePassword from "./pages/ChangePassword";
// import OwnerOrders from "./pages/OwnerOrders";
// import Wishlist from './pages/Wishlist';
// import Footer from './components/Footer';

// function App() {
//   return (
//     <Router>
//       <Routes>
       
//         <Route path="/home" element={<Home />} />
//         <Route path="/dashboard" element={<UserDashboard />} /> 
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/owner-orders" element={<OwnerOrders />} />
//         <Route path="/items" element={<Items />} />
//         <Route path="/category/:slug" element={<CategoryItems />} />
//         <Route path="/items/:id" element={<ItemsDetails />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/my-listings" element={<MyListing />} />
//         <Route path="/add-item" element={<AddItems />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/profile" element={<ProfilePage />} />
//         <Route path="/change-password" element={<ChangePassword />} />
//         <Route path="/owner-order" element={<OwnerOrders />} />
//         <Route path="/wishlist" element={<Wishlist />} />
        
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import UserDashboard from './pages/UserDashboard';
import Orders from "./pages/Orders";
import Items from "./pages/Items";
import CategoryItems from './pages/CategoryItems';
import ItemsDetails from "./pages/ItemsDetails";
import Cart from "./pages/Cart";
import MyListing from "./pages/MyListing";
import AddItems from "./pages/AddItems";
import Checkout from "./pages/Checkout";
import ProfilePage from './pages/ProfilePage';
import ChangePassword from "./pages/ChangePassword";
import OwnerOrders from "./pages/OwnerOrders";
import Wishlist from './pages/Wishlist';
import Footer from './components/Footer';
import HowItWorks from './pages/HowItWorks';
import AboutUs from './pages/AboutUs';
function AppRoutes() {
  const location = useLocation();

  // 👇 Hide footer only on login and signup pages
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup'|| location.pathname ==='/'||
  location.pathname === '/profile';

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<UserDashboard />} />  
        <Route path="/orders" element={<Orders />} />
        <Route path="/owner-order" element={<OwnerOrders />} />
        <Route path="/items" element={<Items />} />
        <Route path="/category/:slug" element={<CategoryItems />} />
        <Route path="/items/:id" element={<ItemsDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-listings" element={<MyListing />} />
        <Route path="/add-item" element={<AddItems />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about-us" element={<AboutUs/>} />
      </Routes>

      {/* 👇 Show footer only if not login or signup */}
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

