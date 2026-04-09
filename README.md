# Grocery E-Store - Full Stack Application

A full-featured grocery e-commerce platform with separate interfaces for sellers and buyers.

## Features

### Seller Features
- Add, edit, and delete products with images
- Manage inventory with low-stock alerts
- View and manage orders
- Update order status (Pending → Preparing → Ready → Delivered)

### Buyer Features
- Browse products by category
- Search products by name or description
- Add items to cart
- Checkout with delivery address
- View order history
- Cash on delivery payment

## Tech Stack

### Frontend
- React 19.2+ with Vite
- React Router v7 for navigation
- Context API for state management
- Axios for API calls

### Backend
- Node.js with Express 5
- MongoDB with Mongoose
- Multer for image uploads
- Simple authentication (prototype)

## Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or connection string)

### Setup Instructions

1. **Clone and navigate to project**
   ```bash
   cd sari2system
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   
   # Make sure MongoDB is running
   # Update .env file if needed (default: mongodb://localhost:27017/grocery-store)
   
   # Start the server
   npm run dev
   ```
   Server will run on http://localhost:5000

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd client
   npm install
   
   # Start the development server
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## Usage

### First Time Setup

1. **Register as Seller**
   - Go to http://localhost:5173
   - Click "Register here"
   - Fill in details and select "Seller" as account type
   - After registration, login with seller credentials

2. **Add Products (Seller)**
   - Once logged in, you'll see the seller dashboard
   - Click "Products" → "+ Add Product"
   - Fill in product details and upload an image
   - Add multiple products

3. **Register as Buyer**
   - Logout from seller account
   - Register a new account with "Buyer" account type

4. **Shop (Buyer)**
   - Login with buyer credentials
   - Browse products, search, and filter by category
   - Add items to cart
   - Proceed to checkout
   - Enter delivery address and place order (Cash on Delivery)

5. **Manage Orders (Seller)**
   - Login as seller
   - Go to "Orders" to see all buyer orders
   - Update order status as you process them

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)
- `GET /api/products/inventory/all` - Get inventory (seller only)
- `PATCH /api/products/:id/stock` - Update stock (seller only)

### Orders
- `POST /api/orders` - Create order (buyer only)
- `GET /api/orders/my-orders` - Get buyer's orders (buyer only)
- `GET /api/orders/all` - Get all orders (seller only)
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status (seller only)
- `PATCH /api/orders/:id/cancel` - Cancel order (buyer only)

## Project Structure

```
sari2system/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # Context providers (Auth, Cart)
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── seller/      # Seller dashboard pages
│   │   │   └── buyer/       # Buyer store pages
│   │   ├── services/        # API service layer
│   │   ├── App.jsx          # Main app with routing
│   │   └── main.jsx         # Entry point
│   └── package.json
│
└── server/                  # Express backend
    ├── config/              # Database configuration
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    ├── controllers/         # Route controllers
    ├── middleware/          # Auth & role check middleware
    ├── uploads/             # Product images (created automatically)
    ├── server.js            # Entry point
    └── package.json
```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-store
NODE_ENV=development
```

## Notes

- **Authentication**: Uses simple header-based auth for prototype. For production, implement JWT tokens and bcrypt password hashing.
- **Image Storage**: Images stored locally in `server/uploads/`. For production, use cloud storage (S3, Cloudinary).
- **Payment**: Currently cash-on-delivery only. Can integrate Stripe/PayPal for real payment processing.

## Future Enhancements

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Payment gateway integration
- Email notifications
- Product reviews and ratings
- Wishlist functionality
- Real-time order tracking
- Multi-vendor support
- Admin dashboard with analytics

## License

MIT
