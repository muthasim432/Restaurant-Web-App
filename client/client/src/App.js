import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate  } from 'react-router-dom';
import MenuPage from './MenuPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import CustomerMenuPage from './CustomerMenuPage';
import CartProvider from './CartContext.js';
import StaffOrdersPage from './StaffOrdersPage';
import ThankYouPage from './ThankYouPage';
import DashboardPage from './DashboardPage';
import ReservationPage from './ReservationPage';
import StaffReservationsPage from './StaffReservationsPage';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ProtectedRoute from './ProtectedRoute';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavPaths = ['/reserve', '/customer-menu','/', '/login', '/register'];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  if (hideNavPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/orders">Staff Orders</Link>
        </li>
        <li><Link to="/reserve">Reserve</Link></li>
        <li><Link to="/staff-reservations">Manage Reservations</Link></li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/customer-menu">Customer Menu</Link>
        </li>

        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <CartProvider>
      <Router>
      <Routes>
      <Route path="/customer-menu" element={<CustomerMenuPage />} />
      </Routes>
        <div>
          <Navigation />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              <Route path="/orders" element={<ProtectedRoute><StaffOrdersPage /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/thank-you" element={<ThankYouPage />} />
              <Route path="/reserve" element={<ReservationPage />} />
              <Route path="/staff-reservations" element={<ProtectedRoute><StaffReservationsPage /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </Router>
    </CartProvider>
  );
};

export default App;
