import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Seller Pages
import Dashboard from './pages/seller/Dashboard';
import Products from './pages/seller/Products';
import Inventory from './pages/seller/Inventory';
import Orders from './pages/seller/Orders';

// Buyer Pages
import Store from './pages/buyer/Store';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import OrderHistory from './pages/buyer/OrderHistory';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Seller Routes */}
            <Route path="/seller" element={
              <ProtectedRoute requiredRole="seller">
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/seller/products" replace />} />
              <Route path="dashboard" element={<Navigate to="/seller/products" replace />} />
              <Route path="products" element={<Products />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* Buyer Routes */}
            <Route path="/store" element={
              <ProtectedRoute requiredRole="buyer">
                <Store />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute requiredRole="buyer">
                <Cart />
              </ProtectedRoute>
            } />
            <Route path="/checkout" element={
              <ProtectedRoute requiredRole="buyer">
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/order-history" element={
              <ProtectedRoute requiredRole="buyer">
                <OrderHistory />
              </ProtectedRoute>
            } />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
