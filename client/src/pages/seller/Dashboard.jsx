import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Grocery Store - Seller</h1>
        <div className="nav-links">
          <Link 
            to="/seller/products" 
            className={location.pathname === '/seller/products' ? 'active' : ''}
          >
            Products
          </Link>
          <Link 
            to="/seller/inventory" 
            className={location.pathname === '/seller/inventory' ? 'active' : ''}
          >
            Inventory
          </Link>
          <Link 
            to="/seller/orders" 
            className={location.pathname === '/seller/orders' ? 'active' : ''}
          >
            Orders
          </Link>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
