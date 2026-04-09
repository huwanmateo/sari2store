import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ type: '', text: ''});

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await ordersAPI.getAllOrders(params);
      setOrders(response.data);
    } catch (error) {
      showMessage('error', 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      showMessage('success', 'Order status updated successfully');
      fetchOrders();
    } catch (error) {
      showMessage('error', 'Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      preparing: '#17a2b8',
      ready: '#28a745',
      delivered: '#6c757d',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="orders-page">
      <div className="page-header">
        <h2>Order Management</h2>
        <div className="order-stats">
          <span className="stat">Total: {orders.length}</span>
        </div>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>{message.text}</div>
      )}

      <div className="filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button 
          className={filter === 'pending' ? 'active' : ''} 
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button 
          className={filter === 'preparing' ? 'active' : ''} 
          onClick={() => setFilter('preparing')}
        >
          Preparing
        </button>
        <button 
          className={filter === 'ready' ? 'active' : ''} 
          onClick={() => setFilter('ready')}
        >
          Ready
        </button>
        <button 
          className={filter === 'delivered' ? 'active' : ''} 
          onClick={() => setFilter('delivered')}
        >
          Delivered
        </button>
      </div>

      <div className="orders-list">
        {orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">
                  <strong>Order ID:</strong> {String(order.id).padStart(8, '0')}
                </div>
                <div 
                  className="order-status" 
                  style={{ background: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </div>
              </div>
              
              <div className="order-body">
                <div className="order-info">
                  <p><strong>Customer:</strong> {order.buyerId.name}</p>
                  <p><strong>Email:</strong> {order.buyerId.email}</p>
                  <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                  <p className="order-total"><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                </div>

                <div className="order-address">
                  <p><strong>Delivery Address:</strong></p>
                  <p>{order.deliveryAddress.street}</p>
                  <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}</p>
                  <p><strong>Phone:</strong> {order.deliveryAddress.phone}</p>
                </div>

                <div className="order-items">
                  <p><strong>Items:</strong></p>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - Qty: {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <div className="order-actions">
                  <label>Update Status:</label>
                  <select 
                    value={order.status} 
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
