const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Buyer routes
router.post('/', auth, roleCheck('buyer'), orderController.createOrder);
router.get('/my-orders', auth, roleCheck('buyer'), orderController.getBuyerOrders);
router.patch('/:id/cancel', auth, roleCheck('buyer'), orderController.cancelOrder);

// Seller routes
router.get('/all', auth, roleCheck('seller'), orderController.getAllOrders);
router.patch('/:id/status', auth, roleCheck('seller'), orderController.updateOrderStatus);

// Both roles can view single order (with authorization check in controller)
router.get('/:id', auth, orderController.getOrder);

module.exports = router;
