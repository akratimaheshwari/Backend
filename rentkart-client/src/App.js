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
import NotFound from './pages/NotFound';
import ProtectedRoute from './pages/ProtectedRoute';
import SearchResults from "./pages/SearchResults";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppRoutes() {
  const location = useLocation();

  //  Hide footer only on login and signup pages
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup'|| location.pathname ==='/'||
  location.pathname === '/profile';

  return (
    <>
    
      <Routes>
  {/* Public Routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/" element={<Home />} />
  <Route path="/how-it-works" element={<HowItWorks />} />
  <Route path="/about-us" element={<AboutUs />} />
  <Route path="/category/:slug" element={<CategoryItems />} />
  <Route path="/items/:id" element={<ItemsDetails />} />
  <Route path="/items" element={<Items />} />

  {/*  Protected Routes */}
  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
  <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
  <Route path="/owner-order" element={<ProtectedRoute><OwnerOrders /></ProtectedRoute>} />
  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  <Route path="/my-listings" element={<ProtectedRoute><MyListing /></ProtectedRoute>} />
  <Route path="/add-item" element={<ProtectedRoute><AddItems /></ProtectedRoute>} />
  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
  <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
  <Route path="/search" element={<SearchResults />} />

  <Route path="*" element={<NotFound />} />
</Routes>

     {/* <ToastContainer position="top-center" autoClose={3000} /> */}
      {/*  Show footer only if not login or signup */}
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
      <>
  <Router>
    <AppRoutes />
  </Router>
  
</>   
  );
}

export default App;

