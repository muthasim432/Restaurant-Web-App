import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Our Restaurant</h1>
      <nav>
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/customer-menu">Customer Menu</Link> 
        <Link to="/orders">Staff Orders</Link>
      </nav>
      <section>
        <h2>About Us</h2>
        <p>Welcome to our restaurant. We offer the best food in town.</p>
      </section>
    </div>
  );
};

export default HomePage;
