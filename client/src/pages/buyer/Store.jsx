import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import './Store.css';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const { user, logout } = useAuth();
  const { addToCart, getCartCount } = useCart();
  const navigate = useNavigate();

  const categories = ['all', 'fruits', 'vegetables', 'dairy', 'bakery', 'beverages', 'snacks', 'meat', 'frozen', 'other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedCategory, searchQuery, products]);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      showMessage('error', 'Product out of stock');
      return;
    }
    addToCart(product);
    showMessage('success', `${product.name} added to cart`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="store-container">
      <nav className="store-nav">
        <h1>🛒 Grocery Store</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="nav-actions">
          <Link to="/order-history" className="nav-link">My Orders</Link>
          <Link to="/cart" className="cart-button">
            🛒 Cart ({getCartCount()})
          </Link>
          <span className="user-name">Hi, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="store-content">
        <aside className="categories-sidebar">
          <h3>Categories</h3>
          <ul>
            {categories.map(cat => (
              <li 
                key={cat}
                className={selectedCategory === cat ? 'active' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </li>
            ))}
          </ul>
        </aside>

        <main className="products-section">
          <div className="section-header">
            <h2>{selectedCategory === 'all' ? 'All Products' : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
            <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    {product.imageUrl ? (
                      <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <span className="stock">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    <div className="product-actions">
                      <Link to={`/product/${product.id}`} className="btn-view">
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="btn-add-cart"
                        disabled={product.stock === 0}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Store;
