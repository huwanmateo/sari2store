const Product = require('../models/Product');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Get all products (with optional filters)
exports.getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (search) {
      where.name = { [Op.like]: `%${search}%` };
    }
    
    const products = await Product.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new product (seller only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      sellerId: req.userId
    });
    
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update product (seller only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if seller owns this product
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    
    // Update image if new one uploaded
    if (req.file) {
      // Delete old image if exists
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      product.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    await product.save();
    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete product (seller only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if seller owns this product
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }
    
    // Delete image if exists
    if (product.imageUrl) {
      const imagePath = path.join(__dirname, '..', product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get inventory (seller only)
exports.getInventory = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { sellerId: req.userId },
      order: [['stock', 'ASC']]
    });
    
    const inventory = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      lowStock: product.stock < 10
    }));
    
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update stock (seller only)
exports.updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if seller owns this product
    if (product.sellerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }
    
    product.stock = stock;
    await product.save();
    
    res.json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
