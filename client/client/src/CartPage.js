import React, { useContext, useEffect } from 'react';
import { CartContext } from './CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateCartItemQuantity, fetchCartItems } = useContext(CartContext);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const calculateTotalPrice = (item) => {
        return item.quantity * item.item.price;
    };

    return (
        <div>
            <h1>Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <ul>
                    {cartItems.map(cartItem => (
                        <li key={cartItem._id}>
                            <h3>{cartItem.item.name}</h3>
                            <p>Price: ${calculateTotalPrice(cartItem)}</p>
                            <p>Quantity: {cartItem.quantity}</p>
                            <button onClick={() => updateCartItemQuantity(cartItem._id, cartItem.quantity + 1)}>+</button>
                            <button onClick={() => updateCartItemQuantity(cartItem._id, cartItem.quantity - 1)}>-</button>
                            <button onClick={() => removeFromCart(cartItem._id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <Link to="/checkout">Proceed to Checkout</Link>
        </div>
    );
};

export default CartPage;
