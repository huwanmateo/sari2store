# 🛒 Grocery E-Store - Full Stack Application

A complete grocery e-commerce platform with separate interfaces for sellers and buyers, built with modern web technologies.

## ✨ Features

### 👨‍💼 Seller Features
- ➕ Add, edit, and delete products with image uploads
- 📦 Inventory management with low-stock alerts (<10 items warning)
- 📋 View and manage all customer orders
- 🔄 Update order status (Pending → Preparing → Ready → Delivered)
- 📊 Product categorization system

### 🛍️ Buyer Features
- 🔍 Browse products by category
- 🔎 Search products by name or description
- 🛒 Shopping cart with quantity management
- 💳 Checkout with delivery address
- 📜 Order history with status tracking
- 💵 Cash on delivery payment

## 🚀 Tech Stack

### Frontend
- **React 19.2** - Modern UI library
- **Vite 8.0** - Lightning-fast build tool
- **React Router v7** - Client-side routing
- **Context API** - State management (Auth, Cart)
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **SQLite + Sequelize** - Lightweight database with ORM
- **Multer** - File upload handling
- **Simple Auth** - Header-based authentication (prototype)

## 📋 Prerequisites

- **Node.js v20 or higher** (Required for Vite 8)
- **npm v9 or higher**
- **Ubuntu 24.04** (Recommended: 2GB RAM, 2 CPU cores minimum)

## 🔧 Installation

### Quick Setup

1. **Navigate to project directory**
   ```bash
   cd /home/jm/sari2system
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   ```

3. **Start the application**
   ```bash
   cd /home/jm/sari2system
   ./start.sh
   ```

   The script will:
   - ✅ Check Node.js version
   - ✅ Auto-install missing dependencies
   - ✅ Start backend on port 5000
   - ✅ Start frontend on port 5173

4. **Open in browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Manual Setup

**Terminal 1 - Backend:**
```bash
cd /home/jm/sari2system/server
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd /home/jm/sari2system/client
npm run dev
```

## 🛑 Stopping the Application

### Using Stop Script
```bash
cd /home/jm/sari2system
./stop.sh
```

### Using Keyboard
If started with `./start.sh`, press **Ctrl+C** once to stop both servers.

### Kill Specific Ports
```bash
# Stop backend (port 5000)
kill -9 $(lsof -t -i:5000)

# Stop frontend (port 5173)
kill -9 $(lsof -t -i:5173)
```

## 🔄 Auto-Start on Boot

To make the application start automatically when your system boots:

### 1. Copy Service File
```bash
sudo cp /home/jm/sari2system/grocery-store.service /etc/systemd/system/
```

### 2. Enable and Start Service
```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start on boot
sudo systemctl enable grocery-store.service

# Start the service now
sudo systemctl start grocery-store.service
```

### 3. Manage Service
```bash
# Check status
sudo systemctl status grocery-store.service

# Stop service
sudo systemctl stop grocery-store.service

# Restart service
sudo systemctl restart grocery-store.service

# Disable auto-start
sudo systemctl disable grocery-store.service

# View logs
sudo journalctl -u grocery-store.service -f
```

## 📖 Usage

### First Time Setup

#### 1. Register as Seller
- Navigate to http://localhost:5173
- Click **"Register here"**
- Fill in your details:
  - Name
  - Email
  - Password
  - Select **"Seller"** as account type
- Click **"Register"**
- Login with your seller credentials

#### 2. Add Products (Seller Dashboard)
- After login, you'll see the seller dashboard
- Click **"Products"** in the sidebar
- Click **"+ Add Product"** button
- Fill in product details:
  - Product name
  - Description
  - Price
  - Category (Fruits, Vegetables, Dairy, etc.)
  - Stock quantity
  - Product image
- Click **"Add Product"**
- Repeat to add more products

#### 3. Register as Buyer
- Logout from seller account (or use incognito/different browser)
- Click **"Register here"**
- Fill in details and select **"Buyer"** as account type
- Login with buyer credentials

#### 4. Shop (Buyer Interface)
- Browse all products on the home page
- Use **category sidebar** to filter products
- Use **search bar** to find specific items
- Click **"Add to Cart"** on products you want
- Click **Cart** icon in header when ready
- Review items and quantities
- Click **"Proceed to Checkout"**
- Enter delivery address:
  - Street address
  - City
  - State
  - Postal code
- Click **"Place Order"**
- View confirmation and order details

#### 5. Manage Orders (Seller Dashboard)
- Login as seller
- Click **"Orders"** in sidebar
- View all customer orders
- Click status dropdown to update:
  - **Pending** → Order received
  - **Preparing** → Being prepared
  - **Ready** → Ready for delivery
  - **Delivered** → Order completed
- Orders refresh automatically

### Product Categories
- 🍎 Fruits
- 🥕 Vegetables
- 🥛 Dairy
- 🍞 Bakery
- 🥤 Beverages
- 🍿 Snacks
- 🥩 Meat
- 🧊 Frozen
- 📦 Other

## 🔌 API Endpoints

All endpoints use `http://localhost:5000/api`

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user info | Yes |

**Headers Required:**
- `x-user-id`: User ID
- `x-user-role`: User role (seller/buyer)

### Products (`/api/products`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/` | Get all products (with filters) | No | All |
| GET | `/:id` | Get single product | No | All |
| POST | `/` | Create new product | Yes | Seller |
| PUT | `/:id` | Update product | Yes | Seller |
| DELETE | `/:id` | Delete product | Yes | Seller |
| GET | `/inventory/all` | Get inventory list | Yes | Seller |
| PATCH | `/:id/stock` | Update product stock | Yes | Seller |

**Query Parameters for GET /:**
- `category` - Filter by category
- `search` - Search in name/description
- `sellerId` - Filter by seller

### Orders (`/api/orders`)
| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/` | Create new order | Yes | Buyer |
| GET | `/my-orders` | Get buyer's orders | Yes | Buyer |
| GET | `/all` | Get all orders | Yes | Seller |
| GET | `/:id` | Get single order | Yes | Both |
| PATCH | `/:id/status` | Update order status | Yes | Seller |
| PATCH | `/:id/cancel` | Cancel order | Yes | Buyer |

**Order Status Flow:**
`pending` → `preparing` → `ready` → `delivered`

## 📁 Project Structure

```
sari2system/
├── 📂 client/                      # React Frontend
│   ├── 📂 public/                  # Static assets
│   ├── 📂 src/
│   │   ├── 📂 components/          # Reusable components
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── 📂 contexts/            # Context API
│   │   │   ├── AuthContext.jsx     # Authentication state
│   │   │   └── CartContext.jsx     # Shopping cart state
│   │   ├── 📂 pages/
│   │   │   ├── 📂 auth/            # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── 📂 seller/          # Seller dashboard
│   │   │   │   ├── Dashboard.jsx   # Main layout
│   │   │   │   ├── Products.jsx    # Product management
│   │   │   │   ├── Inventory.jsx   # Stock tracking
│   │   │   │   └── Orders.jsx      # Order management
│   │   │   └── 📂 buyer/           # Buyer interface
│   │   │       ├── Store.jsx       # Product browsing
│   │   │       ├── Cart.jsx        # Shopping cart
│   │   │       ├── Checkout.jsx    # Checkout process
│   │   │       └── OrderHistory.jsx # Order history
│   │   ├── 📂 services/            # API layer
│   │   │   └── api.js              # Axios configuration & API calls
│   │   ├── App.jsx                 # Main app with routing
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   ├── package.json
│   └── vite.config.js              # Vite configuration
│
├── 📂 server/                      # Express Backend
│   ├── 📂 config/
│   │   └── db.js                   # SQLite/Sequelize configuration
│   ├── 📂 models/                  # Database models
│   │   ├── User.js                 # User model (Sequelize)
│   │   ├── Product.js              # Product model (Sequelize)
│   │   ├── Order.js                # Order model (Sequelize)
│   │   └── index.js                # Model associations
│   ├── 📂 controllers/             # Business logic
│   │   ├── authController.js       # Auth logic
│   │   ├── productController.js    # Product CRUD
│   │   └── orderController.js      # Order management
│   ├── 📂 routes/                  # API routes
│   │   ├── auth.js                 # Auth routes
│   │   ├── products.js             # Product routes
│   │   └── orders.js               # Order routes
│   ├── 📂 middleware/              # Custom middleware
│   │   ├── auth.js                 # Authentication check
│   │   └── roleCheck.js            # Role-based authorization
│   ├── 📂 uploads/                 # Product images (auto-created)
│   ├── database.sqlite             # SQLite database (auto-created)
│   ├── server.js                   # Express app entry point
│   └── package.json
│
├── 📄 start.sh                     # Start both servers
├── 📄 stop.sh                      # Stop all servers
├── 📄 grocery-store.service        # Systemd service file
├── 📄 .gitignore
└── 📄 README.md                    # This file
```

## 🗄️ Database

### SQLite Database
- **File Location:** `/home/jm/sari2system/server/database.sqlite`
- **Type:** File-based database (no separate server needed)
- **ORM:** Sequelize for data modeling
- **Auto-sync:** Tables created automatically on first run

### Database Models

#### User
- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - Unique email address
- `password` - Plain text (prototype - use bcrypt in production)
- `role` - 'seller' or 'buyer'

#### Product
- `id` - Primary key (auto-increment)
- `name` - Product name
- `description` - Product description
- `price` - Decimal price
- `category` - Product category
- `imageUrl` - Path to product image
- `stock` - Available quantity
- `sellerId` - Foreign key to User

#### Order
- `id` - Primary key (auto-increment)
- `buyerId` - Foreign key to User
- `items` - JSON array of order items
- `total` - Total order amount
- `status` - Order status
- `deliveryAddress` - JSON object with address
- `orderDate` - Timestamp

### Reset Database
If you need to start fresh (WARNING: deletes all data):
```bash
cd /home/jm/sari2system/server
rm database.sqlite
node server.js  # Creates new database
```

## 💻 System Requirements

### Development Environment
| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 2 GB | 4 GB |
| CPU Cores | 2 | 4 |
| Storage | 500 MB | 1 GB |
| OS | Ubuntu 22.04+ | Ubuntu 24.04 |
| Node.js | v20.0.0 | v20.19.0+ |

### Production Environment (Low Traffic)
| Component | Specification |
|-----------|---------------|
| RAM | 2 GB |
| CPU Cores | 1-2 |
| Storage | 1 GB |
| Database | SQLite (file-based) |

**Note:** For high traffic production, consider migrating to PostgreSQL or MySQL and scaling horizontally.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the ports
lsof -i :5000  # Backend
lsof -i :5173  # Frontend

# Kill processes
kill -9 $(lsof -t -i:5000)
kill -9 $(lsof -t -i:5173)

# Or use the stop script
./stop.sh
```

### Node.js Version Issues
```bash
# Check version
node --version

# Should be v20 or higher. If not, update:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

### Database Errors
```bash
# Foreign key constraint errors
cd /home/jm/sari2system/server
rm database.sqlite
node server.js  # Creates fresh database

# Permission errors
chmod 664 database.sqlite
```

### Cart Issues
Clear cart data in browser console (F12):
```javascript
localStorage.removeItem('cart')
localStorage.removeItem('user')
location.reload()
```

### Module Not Found
```bash
# Reinstall dependencies
cd /home/jm/sari2system/server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Image Upload Not Working
```bash
# Check uploads directory exists and has permissions
cd /home/jm/sari2system/server
mkdir -p uploads
chmod 755 uploads
```

### Service Won't Start on Boot
```bash
# Check service status
sudo systemctl status grocery-store.service

# View detailed logs
sudo journalctl -u grocery-store.service -n 50

# Verify paths in service file
cat /etc/systemd/system/grocery-store.service

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart grocery-store.service
```

## 🔐 Security Notes

**⚠️ This is a PROTOTYPE implementation. For production:**

1. **Authentication:**
   - Implement JWT with refresh tokens
   - Use bcrypt for password hashing
   - Add rate limiting to prevent brute force
   - Implement CSRF protection

2. **Database:**
   - Migrate to PostgreSQL/MySQL for production
   - Add database backups
   - Implement connection pooling
   - Use parameterized queries (Sequelize handles this)

3. **API Security:**
   - Add input validation and sanitization
   - Implement API rate limiting
   - Add CORS whitelist (currently allows all origins)
   - Use HTTPS in production

4. **File Uploads:**
   - Validate file types and sizes
   - Scan for malware
   - Use cloud storage (S3, Cloudinary)
   - Generate unique filenames

5. **Environment:**
   - Use environment variables for secrets
   - Never commit `.env` files
   - Use secrets management (Vault, AWS Secrets Manager)

## 📝 Environment Variables

### Backend (.env)
Create `/home/jm/sari2system/server/.env`:
```env
PORT=5000
NODE_ENV=development
```

SQLite doesn't require database connection strings.

## 🚀 Deployment

### Production Build

1. **Build Frontend:**
   ```bash
   cd /home/jm/sari2system/client
   npm run build
   ```
   Creates optimized static files in `client/dist/`

2. **Serve Static Files:**
   Configure Express to serve the built React app:
   ```javascript
   // Add to server/server.js
   app.use(express.static(path.join(__dirname, '../client/dist')));
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, '../client/dist/index.html'));
   });
   ```

3. **Use Production Database:**
   - Migrate to PostgreSQL or MySQL
   - Configure connection pooling
   - Set up regular backups

4. **Use Process Manager:**
   ```bash
   # Install PM2
   sudo npm install -g pm2
   
   # Start with PM2
   cd /home/jm/sari2system/server
   pm2 start server.js --name grocery-store
   pm2 save
   pm2 startup
   ```

## 🎯 Future Enhancements

- [ ] JWT authentication with bcrypt password hashing
- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications for orders
- [ ] SMS notifications
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Real-time order tracking with WebSockets
- [ ] Multi-vendor support
- [ ] Admin dashboard with analytics
- [ ] Export orders to CSV/PDF
- [ ] Discount codes and promotions
- [ ] Product recommendations
- [ ] Mobile app (React Native)

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 👨‍💻 Author

Created as a full-stack demonstration project for grocery e-commerce.

## 🤝 Contributing

This is a learning/demo project. Feel free to fork and customize for your needs!

---

**Need help?** Check the troubleshooting section or review the inline code comments.
