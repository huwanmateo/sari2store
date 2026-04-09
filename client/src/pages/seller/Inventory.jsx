import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';
import './Inventory.css';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await productsAPI.getInventory();
      setInventory(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleUpdateStock = async (productId) => {
    try {
      await productsAPI.updateStock(productId, parseInt(newStock));
      showMessage('success', 'Stock updated successfully');
      setEditingStock(null);
      setNewStock('');
      fetchInventory();
    } catch (error) {
      showMessage('error', 'Failed to update stock');
    }
  };

  const startEditing = (item) => {
    setEditingStock(item.id);
    setNewStock(item.stock.toString());
  };

  const cancelEditing = () => {
    setEditingStock(null);
    setNewStock('');
  };

  const lowStockCount = inventory.filter(item => item.lowStock).length;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h2>Inventory Management</h2>
        {lowStockCount > 0 && (
          <div className="alert-badge">
            ⚠ {lowStockCount} item{lowStockCount > 1 ? 's' : ''} low on stock
          </div>
        )}
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No products in inventory</td>
              </tr>
            ) : (
              inventory.map(item => (
                <tr key={item.id} className={item.lowStock ? 'low-stock-row' : ''}>
                  <td className="product-name">{item.name}</td>
                  <td className="category-cell">
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td className="price-cell">${item.price.toFixed(2)}</td>
                  <td className="stock-cell">
                    {editingStock === item.id ? (
                      <input
                        type="number"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        min="0"
                        className="stock-input"
                        autoFocus
                      />
                    ) : (
                      <strong>{item.stock}</strong>
                    )}
                  </td>
                  <td className="status-cell">
                    {item.lowStock ? (
                      <span className="status-badge low">Low Stock</span>
                    ) : (
                      <span className="status-badge good">In Stock</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    {editingStock === item.id ? (
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleUpdateStock(item.id)} 
                          className="btn-save"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEditing} 
                          className="btn-cancel"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEditing(item)} 
                        className="btn-update"
                      >
                        Update Stock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
