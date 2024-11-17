const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Category = require('./model/Category');
const Item = require('./model/Item');
const Cart = require('./model/Cart');
const Order = require('./model/Order');
const ReservationService = require('./client/client/src/ReservationService'); 

const AuthService = require('./client/client/src/AuthService'); 
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const dbURI = 'mongodb://localhost:27017/restaurant-app';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));



// Authentication middleware
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
      const decoded = jwt.verify(token, 'secret');
      req.user = decoded.id;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  };
  
  
  app.post('/api/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await AuthService.register(username, password);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const { user, token } = await AuthService.login(username, password);
      res.json({ user, token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// Sales route
app.get('/sales', async (req, res) => {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const salesData = await Order.getSalesData(startOfDay, startOfWeek, startOfMonth);

        res.json(salesData);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Order routes
app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.fetchOrders();
        res.json(orders);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/orders', async (req, res) => {
    try {
        const { items, total, deliveryOption, customerDetails } = req.body;
        const newOrder = new Order({
            items,
            total,
            deliveryOption,
            customerDetails: {
                name: customerDetails.name,
                email: customerDetails.email,
                phone: customerDetails.phone,
                address: customerDetails.address
            },
            paymentDetails: {
                cardNumber: customerDetails.cardNumber,
                cardExpiry: customerDetails.cardExpiry,
                cardCVV: customerDetails.cardCVV
            }
        });
        await newOrder.save();
        await Cart.findOneAndUpdate({}, { $set: { items: [] } }); // Clear the cart after order is placed
        res.json(newOrder);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/orders/:id/fulfill', async (req, res) => {
    try {
        const order = await Order.fulfillOrder(req.params.id);
        res.json(order);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/orders/:id', async (req, res) => {
    try {
        await Order.cancelOrder(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

// Cart routes
app.get('/cart', async (req, res) => {
    try {
        const cart = await Cart.findOne().populate('items.item'); // Populate item details
        res.json(cart ? cart.items : []);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/cart', async (req, res) => {
    try {
        let cart = await Cart.findOne();
        if (!cart) {
            cart = new Cart({ items: [] });
        }
        const existingItemIndex = cart.items.findIndex(cartItem => cartItem.item.toString() === req.body.item);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += req.body.quantity;
        } else {
            cart.items.push(req.body);
        }
        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/cart/:id', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);
        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/cart', async (req, res) => {
    try {
        await Cart.findOneAndUpdate({}, { $set: { items: [] } });
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/cart/:id', async (req, res) => {
    try {
        const cart = await Cart.findOne();
        if (!cart) {
            return res.status(404).send('Cart not found');
        }
        const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.id);
        if (itemIndex === -1) {
            return res.status(404).send('Item not found in cart');
        }
        cart.items[itemIndex].quantity = req.body.quantity;
        await cart.save();
        res.json(cart.items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.getAllCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add category
app.post('/categories', async (req, res) => {
    try {
        const category = await Category.createCategory(req.body.name);
        res.json(category);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update category
app.put('/categories/:id', async (req, res) => {
    try {
        const category = await Category.updateCategory(req.params.id, req.body.name);
        res.json(category);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete category
app.delete('/categories/:id', async (req, res) => {
    try {
        await Category.deleteCategory(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get all items with category populated
app.get('/menu-items', async (req, res) => {
    try {
        const items = await Item.getAllItems();
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Add item
app.post('/items', async (req, res) => {
    try {
        const item = await Item.createItem(req.body);
        res.json(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update item
app.put('/items/:id', async (req, res) => {
    try {
        const item = await Item.updateItem(req.params.id, req.body);
        res.json(item);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete item
app.delete('/items/:id', async (req, res) => {
    try {
        await Item.deleteItem(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get items by category
app.get('/categories/:id/items', async (req, res) => {
    try {
        const items = await Item.find({ category: req.params.id }).populate('category');
        res.json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Reservation routes
app.post('/reservations', async (req, res) => {
    try {
        const reservation = await ReservationService.createReservation(req.body);
        res.json(reservation);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/reservations', async (req, res) => {
    try {
        const reservations = await ReservationService.getAllReservations();
        res.json(reservations);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/reservations/:id', async (req, res) => {
    try {
        const reservation = await ReservationService.getReservationById(req.params.id);
        res.json(reservation);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/reservations/:id', async (req, res) => {
    try {
        const updatedReservation = await ReservationService.updateReservation(req.params.id, req.body);
        res.json(updatedReservation);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.delete('/reservations/:id', async (req, res) => {
    try {
        await ReservationService.deleteReservation(req.params.id);
        res.json({ message: 'Reservation deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
