import axios from 'axios';

class OrderService {
  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000'
    });
  }

  async fetchOrders() {
    try {
      const response = await this.api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async fulfillOrder(orderId) {
    try {
      await this.api.put(`/orders/${orderId}/fulfill`);
    } catch (error) {
      console.error('Error fulfilling order:', error);
      throw error;
    }
  }

  async placeOrder(orderData) {
    try {
      const response = await this.api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  async cancelOrder(orderId) {
    try {
      await this.api.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }
}

export default new OrderService();
