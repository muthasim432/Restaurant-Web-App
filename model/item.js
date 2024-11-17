const mongoose = require('mongoose');
const Category = require('./Category');

// Item Schema
const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

class ItemClass {
    static async createItem(data) {
        const item = new this(data);
        return item.save();
    }

    static async getAllItems() {
        return this.find().populate('category');
    }

    static async updateItem(id, data) {
        return this.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteItem(id) {
        return this.findByIdAndDelete(id);
    }
}

ItemSchema.loadClass(ItemClass);
const Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
