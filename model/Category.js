const mongoose = require('mongoose');

// Category Schema
const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

class CategoryClass {
    static async createCategory(name) {
        const category = new this({ name });
        return category.save();
    }

    static async getAllCategories() {
        return this.find();
    }

    static async updateCategory(id, name) {
        return this.findByIdAndUpdate(id, { name }, { new: true });
    }

    static async deleteCategory(id) {
        return this.findByIdAndDelete(id);
    }
}

CategorySchema.loadClass(CategoryClass);
const Category = mongoose.model('Category', CategorySchema);
module.exports = Category;
