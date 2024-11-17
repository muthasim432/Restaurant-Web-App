import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CategoryService from './CategoryService';
import { CartContext } from './CartContext';
import './CustomerMenuPage.css'; 

const CustomerMenuPage = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const { cartItems, addToCart, removeFromCart, updateCartItemQuantity, fetchCartItems } = useContext(CartContext);
    const [isCartOpen, setIsCartOpen] = useState(false); 

    // Memoize the fetchCartItems function
    const memoizedFetchCartItems = useCallback(fetchCartItems, [fetchCartItems]);

    useEffect(() => {
        fetchCategories();
        memoizedFetchCartItems();
    }, [memoizedFetchCartItems]);

    const fetchCategories = async () => {
        try {
            const data = await CategoryService.getCategories();
            setCategories(data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            setCategories([]);
        }
    };

    const fetchItemsByCategory = async (categoryId) => {
        try {
            const data = await CategoryService.getItemsByCategory(categoryId);
            setMenuItems(data || []);
        } catch (error) {
            console.error('Failed to fetch items:', error);
            setMenuItems([]);
        }
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen); // Toggle the cart panel
    };

    const openCart = () => {
        setIsCartOpen(true); // Open the cart panel
    };

    const handleAddToCart = (item) => {
        addToCart(item);
        openCart(); // Open the cart panel when an item is added
    };

    const calculateTotalPrice = (item) => {
        return item.quantity * (item.item.price || 0);
    };

    return (
        <div className="container">
            <div className="header">
                <Link to="/reserve" className="book-table-button">Book a Table</Link>
                <h1 className="centered-heading"> MENU</h1>
                <div className="cart-icon" onClick={toggleCart}>
                    <i className="fas fa-shopping-cart"></i>
                </div>
            </div>
            <div className="category-buttons-container">
                <div className="category-buttons">
                    {categories.map(category => (
                        <button key={category?._id} onClick={() => fetchItemsByCategory(category?._id)}>
                            {category?.name || 'Unnamed Category'}
                        </button>
                    ))}
                </div>
            </div>
            <div className="menu-items">
                {menuItems.map(item => (
                    <div key={item?._id} className="menu-item">
                        <h3>{item?.name || 'Unnamed Item'}</h3>
                        <p>{item?.description || 'No description available'}</p>
                        <p>Price: ${item?.price || 0}</p>
                        <button onClick={() => handleAddToCart({ item: item?._id, quantity: 1 })}>Add to Cart</button>
                    </div>
                ))}
            </div>
            <div className={`cart-panel ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-panel-header">
                    <h2>Your Cart</h2>
                    <div className="cart-panel-close" onClick={toggleCart}>✖</div>
                </div>
                <div className="cart-panel-body">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <ul>
                            {cartItems.map(cartItem => (
                                <li key={cartItem?._id}>
                                    <h3>{cartItem?.item?.name || 'Unnamed Item'}</h3>
                                    <p>Price: ${calculateTotalPrice(cartItem)}</p>
                                    <p>Quantity: {cartItem?.quantity}</p>
                                    <button onClick={() => updateCartItemQuantity(cartItem?._id, cartItem?.quantity + 1)}>+</button>
                                    <button onClick={() => updateCartItemQuantity(cartItem?._id, cartItem?.quantity - 1)}>-</button>
                                    <button onClick={() => removeFromCart(cartItem?._id)}>Remove</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="cart-panel-footer">
                    <Link to="/checkout" onClick={toggleCart}>Proceed to Checkout</Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerMenuPage;
