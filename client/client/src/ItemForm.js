import React, { useState, useEffect } from 'react';

const ItemForm = ({ categories, onAddItem, onUpdateItem, selectedItem, setSelectedItem }) => {
    const [item, setItem] = useState({
        name: '',
        description: '',
        price: '',
        category: ''
    });

    useEffect(() => {
        if (selectedItem) {
            setItem({
                name: selectedItem.name,
                description: selectedItem.description,
                price: selectedItem.price,
                category: selectedItem.category
            });
        }
    }, [selectedItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem({ ...item, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedItem) {
            onUpdateItem(selectedItem._id, item);
        } else {
            onAddItem(item);
        }
        setItem({ name: '', description: '', price: '', category: '' });
        setSelectedItem(null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                value={item.name}
                onChange={handleChange}
                placeholder="Item Name"
                required
            />
            <input
                type="text"
                name="description"
                value={item.description}
                onChange={handleChange}
                placeholder="Item Description"
                required
            />
            <input
                type="number"
                name="price"
                value={item.price}
                onChange={handleChange}
                placeholder="Item Price"
                required
            />
            <select
                name="category"
                value={item.category}
                onChange={handleChange}
                required
            >
                <option value="">Select Category</option>
                {categories.map(category => (
                    <option key={category._id} value={category._id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <button type="submit">{selectedItem ? 'Update' : 'Add'} Item</button>
        </form>
    );
};

export default ItemForm;
