import axios from 'axios';

class CategoryService {
    static async getCategories() {
        const response = await axios.get('http://localhost:5000/categories');
        return response.data;
    }

    static async createCategory(name) {
        const response = await axios.post('http://localhost:5000/categories', { name });
        return response.data;
    }

    static async updateCategory(id, name) {
        const response = await axios.put(`http://localhost:5000/categories/${id}`, { name });
        return response.data;
    }

    static async deleteCategory(id) {
        await axios.delete(`http://localhost:5000/categories/${id}`);
    }

    static async getItemsByCategory(categoryId) {
        const response = await axios.get(`http://localhost:5000/categories/${categoryId}/items`);
        return response.data;
    }
}

export default CategoryService;
