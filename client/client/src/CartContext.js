import React, { createContext, useState, useEffect } from 'react';
import CartService from './CartService';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const fetchCartItems = async () => {
        const items = await CartService.getCartItems();
        setCartItems(items);
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const addToCart = async (item) => {
        await CartService.addToCart(item);
        fetchCartItems();
    };

    const removeFromCart = async (itemId) => {
        await CartService.removeFromCart(itemId);
        fetchCartItems();
    };

    const updateCartItemQuantity = async (itemId, quantity) => {
        await CartService.updateCartItemQuantity(itemId, quantity);
        fetchCartItems();
    };
    const clearCart = async () => {
        await CartService.clearCart();
        setCartItems([]);
    };


    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity, fetchCartItems }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;