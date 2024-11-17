import React, { useState, useEffect } from 'react';
import OrderService from './OrderService';
import Modal from 'react-modal';

const StaffOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const orders = await OrderService.fetchOrders();
      setOrders(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fulfillOrder = async (orderId) => {
    try {
      await OrderService.fulfillOrder(orderId);
      fetchOrders(); // Refresh orders after fulfilling one
      closeModal(); // Close the modal after fulfilling the order
    } catch (error) {
      console.error('Error fulfilling order:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await OrderService.cancelOrder(orderId);
      fetchOrders(); // Refresh orders after canceling one
      closeModal(); // Close the modal after canceling the order
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleToggleOrder = (orderId) => {
    setExpandedOrder(orderId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExpandedOrder(null);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString(); // Format the date and time in a readable format
  };

  const filteredOrders = orders.filter(order => order.status === (activeTab === 'pending' ? 'Pending' : 'Fulfilled'));

  return (
    <div>
      <h1>Orders</h1>
      <div>
        <button onClick={() => handleTabChange('pending')} style={{ marginRight: '10px' }}>Pending Orders</button>
        <button onClick={() => handleTabChange('fulfilled')}>Fulfilled Orders</button>
      </div>
      {filteredOrders.length === 0 ? (
        <p>No orders to display</p>
      ) : (
        <ul>
          {filteredOrders.map(order => (
            <li key={order._id}>
              <h3>Order ID: {order._id}</h3>
              <p onClick={() => handleToggleOrder(order._id)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Customer: {order.customerDetails.name}
              </p>
              <p>Order Date: {formatDateTime(order.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
      {expandedOrder && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Order Details"
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              width: '50%', 
              maxHeight: '80%', 
              overflow: 'auto'
            },
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={closeModal} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
          </div>
          {orders.filter(order => order._id === expandedOrder).map(order => (
            <div key={order._id}>
              <p>Email: {order.customerDetails.email}</p>
              <p>Phone: {order.customerDetails.phone}</p>
              <p>Address: {order.customerDetails.address}</p>
              <p>Order Date: {formatDateTime(order.createdAt)}</p>
              <p>Delivery Option: {order.deliveryOption}</p> {/* Show delivery option */}
              <h4>Items</h4>
              <ul>
                {order.items.map(item => (
                  <li key={item.item._id}>
                    <p>Name: {item.item.name}</p>
                    <p>Price: ${item.item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total: ${item.quantity * item.item.price}</p>
                  </li>
                ))}
              </ul>
              <p>Total: ${order.total}</p>
              <p>Status: {order.status}</p>
              {activeTab === 'pending' && (
                <div>
                  <button onClick={() => fulfillOrder(order._id)}>Fulfill Order</button>
                  <button onClick={() => cancelOrder(order._id)} style={{ marginLeft: '10px' }}>Cancel Order</button>
                </div>
              )}
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

export default StaffOrdersPage;
