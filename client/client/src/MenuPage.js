import React, { useState, useEffect } from 'react';
import CategoryService from './CategoryService';
import ItemService from './ItemService';
import './MenuPage.css';

const MenuPage = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState({ id: '', name: '' });
    const [newItem, setNewItem] = useState({
        name: '',
        description: '',
        price: '',
        category: ''
    });
    const [editItem, setEditItem] = useState({
        id: '',
        name: '',
        description: '',
        price: '',
        category: ''
    });
    const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
    const [isEditCategoryFormOpen, setIsEditCategoryFormOpen] = useState(false);
    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [isEditItemFormOpen, setIsEditItemFormOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
        fetchMenuItems();
    }, []);

    const fetchCategories = async () => {
        const data = await CategoryService.getCategories();
        setCategories(data);
    };

    const fetchMenuItems = async () => {
        const data = await ItemService.getItems();
        setMenuItems(data);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        await CategoryService.createCategory(newCategory);
        setNewCategory('');
        setIsCategoryFormOpen(false);
        fetchCategories();
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        await CategoryService.updateCategory(editCategory.id, editCategory.name);
        setEditCategory({ id: '', name: '' });
        setIsEditCategoryFormOpen(false);
        fetchCategories();
    };

    const handleDeleteCategory = async (categoryId) => {
        await CategoryService.deleteCategory(categoryId);
        fetchCategories();
        fetchMenuItems(); 
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        await ItemService.createItem(newItem);
        setNewItem({ name: '', description: '', price: '', category: '' });
        setIsItemFormOpen(false);
        fetchMenuItems();
    };

    const handleUpdateItem = async (e) => {
        e.preventDefault();
        await ItemService.updateItem(editItem.id, editItem);
        setEditItem({ id: '', name: '', description: '', price: '', category: '' });
        setIsEditItemFormOpen(false);
        fetchMenuItems();
    };

    const handleDeleteItem = async (itemId) => {
        await ItemService.deleteItem(itemId);
        fetchMenuItems();
    };

    const handleEditCategory = (category) => {
        setEditCategory({ id: category._id, name: category.name });
        setIsEditCategoryFormOpen(true);
    };

    const handleEditItem = (item) => {
        setEditItem({ id: item._id, name: item.name, description: item.description, price: item.price, category: item.category._id });
        setIsEditItemFormOpen(true);
    };

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId === activeCategory ? null : categoryId);
    };

    return (
        <div>
            <div className="menu-header">
                <h1>Menu Management</h1>
                <div className="header-buttons">
                    <button onClick={() => setIsCategoryFormOpen(true)}>Add Category</button>
                    <button onClick={() => setIsItemFormOpen(true)}>Add Item</button>
                </div>
            </div>

            {isCategoryFormOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <span className="popup-close" onClick={() => setIsCategoryFormOpen(false)}>&times;</span>
                        <form onSubmit={handleAddCategory}>
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New Category Name"
                                required
                            />
                            <button type="submit">Add Category</button>
                        </form>
                    </div>
                </div>
            )}

            {isEditCategoryFormOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <span className="popup-close" onClick={() => setIsEditCategoryFormOpen(false)}>&times;</span>
                        <form onSubmit={handleUpdateCategory}>
                            <input
                                type="text"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                placeholder="Update Category Name"
                                required
                            />
                            <button type="submit">Update Category</button>
                        </form>
                    </div>
                </div>
            )}

            {isItemFormOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <span className="popup-close" onClick={() => setIsItemFormOpen(false)}>&times;</span>
                        <form onSubmit={handleAddItem}>
                            <input
                                type="text"
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="Item Name"
                                required
                            />
                            <input
                                type="text"
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                placeholder="Item Description"
                                required
                            />
                            <input
                                type="number"
                                value={newItem.price}
                                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                placeholder="Item Price"
                                required
                            />
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit">Add Item</button>
                        </form>
                    </div>
                </div>
            )}

            {isEditItemFormOpen && (
                <div className="popup">
                    <div className="popup-inner">
                        <span className="popup-close" onClick={() => setIsEditItemFormOpen(false)}>&times;</span>
                        <form onSubmit={handleUpdateItem}>
                            <input
                                type="text"
                                value={editItem.name}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                placeholder="Update Item Name"
                                required
                            />
                            <input
                                type="text"
                                value={editItem.description}
                                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                placeholder="Update Item Description"
                                required
                            />
                            <input
                                type="number"
                                value={editItem.price}
                                onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                placeholder="Update Item Price"
                                required
                            />
                            <select
                                value={editItem.category}
                                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button type="submit">Update Item</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="category-buttons-container">
                <div className="category-buttons">
                    {categories.map(category => (
                        <button className="category-names" key={category._id} onClick={() => handleCategoryClick(category._id)}>
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {categories.map(category => (
                <div key={category._id} className={`menu-category ${activeCategory === category._id ? 'active' : ''}`}>
                    <div className="category-header">
                        <h2>{category.name}</h2>
                        <div className="category-buttons-right">
                            <button className="edit-category-button" onClick={() => handleEditCategory(category)}>Edit Category</button>
                            <button className="delete-category-button" onClick={() => handleDeleteCategory(category._id)}>Delete Category</button>
                        </div>
                    </div>
                    {activeCategory === category._id && (
                        <div className="menu-items">
                            {menuItems
                                .filter(item => item.category && item.category._id === category._id)
                                .map(item => (
                                    <div key={item._id} className="menu-item">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <p>Price: ${item.price}</p>
                                        <button className="edit-category-button" onClick={() => handleEditItem(item)}>Edit Item</button>
                                        <button className="edit-category-button" onClick={() => handleDeleteItem(item._id)}>Delete Item</button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MenuPage;
