const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 }
});

const CartSchema = new mongoose.Schema({
    items: [CartItemSchema]
});
CartSchema.methods.clearCart = function () {
    this.items = [];
    return this.save();
};
module.exports = mongoose.model('Cart', CartSchema);
