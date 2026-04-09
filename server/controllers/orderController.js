const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Create new order (buyer only)
exports.createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;
    
    // Validate and calculate total
    let total = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}` 
        });
      }
      
      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
      
      orderItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
      
      total += product.price * item.quantity;
    }
    
    // Create order
    const order = await Order.create({
      buyerId: req.userId,
      items: orderItems,
      total,
      deliveryAddress,
      status: 'pending'
    });
    
    res.status(201).json({ 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get buyer's orders
exports.getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.userId },
      order: [['orderDate', 'DESC']]
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all orders (seller only)
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let where = {};
    
    if (status) {
      where.status = status;
    }
    
    const orders = await Order.findAll({
      where,
      order: [['orderDate', 'DESC']],
      include: [{
        model: User,
        as: 'buyer',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'buyer',
        attributes: ['id', 'name', 'email']
      }]
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check authorization
    if (req.userRole === 'buyer' && order.buyerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update order status (seller only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel order (buyer only, only if status is pending)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.buyerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }
    
    if (order.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot cancel order. It is already being processed.' 
      });
    }
    
    // Restore stock
    for (const item of order.items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    order.status = 'cancelled';
    await order.save();
    
    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
