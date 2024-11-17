import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from './CartContext';
import './CheckoutPage.css'; 
const CheckoutPage = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: ''
  });

  const [deliveryOption, setDeliveryOption] = useState(''); 
  const handleInputChange = (e) => {
    setCustomerDetails({
      ...customerDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleDeliveryOptionChange = (e) => {
    setDeliveryOption(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add items to the cart before checking out.');
      return;
    }
    if (!deliveryOption) {
      alert('Please select a delivery option.');
      return;
    }
    axios.post('http://localhost:5000/orders', {
      items: cartItems.map(cartItem => ({ item: cartItem.item._id, quantity: cartItem.quantity })),
      total: cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.item.price, 0),
      deliveryOption, 
      customerDetails
    }).then(response => {
      console.log('Order placed:', response.data);
      navigate('/thank-you'); // Redirect to Thank You page
    }).catch(error => {
      console.error('Error placing order:', error);
    });
  };

  const calculateTotalSum = () => {
    return cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.item.price, 0).toFixed(2);
  };

  return (
    <div>
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="order-summary">
          <h2>Order Summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <ul>
              {cartItems.map(cartItem => (
                <li key={cartItem._id}>
                  <h3>{cartItem.item.name} x {cartItem.quantity} = ${(cartItem.quantity * cartItem.item.price).toFixed(2)}</h3>
                </li>
              ))}
              <li>
                <h3>Total: ${calculateTotalSum()}</h3>
              </li>
            </ul>
          )}
        </div>
        <div className="customer-details">
          <h2>Customer Details</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Name" onChange={handleInputChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />
            <input type="tel" name="phone" placeholder="Phone" onChange={handleInputChange} required />
            <input type="text" name="address" placeholder="Address" onChange={handleInputChange} required />
            <h2>Delivery Option</h2>
            <select name="deliveryOption" value={deliveryOption} onChange={handleDeliveryOptionChange} required>
              <option value="">Select an option</option>
              <option value="Delivery">Delivery</option>
              <option value="Pickup">Pickup</option>
            </select>
            <h2>Payment Details</h2>
            <input type="text" name="cardNumber" placeholder="Card Number" onChange={handleInputChange} required />
            <input type="text" name="cardExpiry" placeholder="Expiry Date (MM/YY)" onChange={handleInputChange} required />
            <input type="text" name="cardCVV" placeholder="CVV" onChange={handleInputChange} required />
            <button type="submit">Complete Payment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
