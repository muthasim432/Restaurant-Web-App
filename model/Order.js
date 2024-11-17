const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: [{ item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }, quantity: Number }],
    total: Number,
    deliveryOption: String,
    customerDetails: {
        name: String,
        email: String,
        phone: String,
        address: String,
        cardNumber: String,
        cardExpiry: String,
        cardCVV: String
    },
    status: { type: String, default: 'Pending' }, //  'Pending', 'Fulfilled'
    createdAt: { type: Date, default: Date.now }
});

OrderSchema.statics.getSalesData = async function (startOfDay, startOfWeek, startOfMonth) {
    const dailySales = await this.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const weeklySales = await this.aggregate([
        { $match: { createdAt: { $gte: startOfWeek } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const monthlySales = await this.aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    return {
        daily: dailySales[0] ? dailySales[0].total : 0,
        weekly: weeklySales[0] ? weeklySales[0].total : 0,
        monthly: monthlySales[0] ? monthlySales[0].total : 0
    };
};

OrderSchema.statics.fetchOrders = async function () {
    return await this.find().populate('items.item');
};

OrderSchema.statics.fulfillOrder = async function (orderId) {
    const order = await this.findById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    order.status = 'Fulfilled';
    await order.save();
    return order;
};

OrderSchema.statics.cancelOrder = async function (orderId) {
    const order = await this.findByIdAndDelete(orderId);
    if (!order) {
        throw new Error('Order not found');
    }
    return order;
};

module.exports = mongoose.model('Order', OrderSchema);
