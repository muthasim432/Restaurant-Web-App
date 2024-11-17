import React from 'react';
import './CategoryList.css'; 

const CategoryList = ({ categories, menuItems, onEditCategory, onDeleteCategory, onEditItem, onDeleteItem, toggleCategory, expandedCategories }) => {
    return (
        <div>
            {categories.map(category => (
                <div key={category._id} className="category-container">
                    <div className="category-header">
                        <h2 onClick={() => toggleCategory(category._id)} style={{ cursor: 'pointer' }}>{category.name}</h2>
                        <div className="category-buttons">
                            <button className="edit-button" onClick={() => onEditCategory(category)}>Edit Category</button>
                            <button className="delete-button" onClick={() => onDeleteCategory(category._id)}>Delete Category</button>
                        </div>
                    </div>
                    {expandedCategories.includes(category._id) && (
                        <div className="items-container">
                            {menuItems
                                .filter(item => item.category && item.category._id === category._id)
                                .map(item => (
                                    <div key={item._id} className="item-card">
                                        <h3>{item.name}</h3>
                                        <p>{item.description}</p>
                                        <p>Price: ${item.price}</p>
                                        <button className="edit-button" onClick={() => onEditItem(item)}>Edit Item</button>
                                        <button className="delete-button" onClick={() => onDeleteItem(item._id)}>Delete Item</button>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CategoryList;
