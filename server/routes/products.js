const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Seller only routes
router.post('/', auth, roleCheck('seller'), upload.single('image'), productController.createProduct);
router.put('/:id', auth, roleCheck('seller'), upload.single('image'), productController.updateProduct);
router.delete('/:id', auth, roleCheck('seller'), productController.deleteProduct);
router.get('/inventory/all', auth, roleCheck('seller'), productController.getInventory);
router.patch('/:id/stock', auth, roleCheck('seller'), productController.updateStock);

module.exports = router;
