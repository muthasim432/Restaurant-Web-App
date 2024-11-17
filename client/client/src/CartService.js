import axios from 'axios';

class CartService {
    async getCartItems() {
        const response = await axios.get('http://localhost:5000/cart');
        return response.data;
    }

    async addToCart(item) {
        const response = await axios.post('http://localhost:5000/cart', item);
        return response.data;
    }

    async removeFromCart(itemId) {
        const response = await axios.delete(`http://localhost:5000/cart/${itemId}`);
        return response.data;
    }

    async updateCartItemQuantity(itemId, quantity) {
        const response = await axios.put(`http://localhost:5000/cart/${itemId}`, { quantity });
        return response.data;
    }
    static async clearCart() {
        await axios.delete('http://localhost:5000/cart');
    }
}

export default new CartService();






