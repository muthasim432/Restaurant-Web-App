import axios from 'axios';

class ItemService {
    static async getItems() {
        const response = await axios.get('http://localhost:5000/menu-items');
        return response.data;
    }

    static async createItem(itemData) {
        const response = await axios.post('http://localhost:5000/items', itemData);
        return response.data;
    }

    static async updateItem(id, itemData) {
        const response = await axios.put(`http://localhost:5000/items/${id}`, itemData);
        return response.data;
    }

    static async deleteItem(id) {
        await axios.delete(`http://localhost:5000/items/${id}`);
    }
}

export default ItemService;
