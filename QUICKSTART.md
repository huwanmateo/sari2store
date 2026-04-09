# 🚀 Quick Start Guide - Grocery E-Store

## For New Ubuntu 24.04 VM

### 1. Install Node.js v20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x.x
```

### 2. Clone/Navigate to Project
```bash
cd /home/jm/sari2system
```

### 3. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
cd ..
```

### 4. Start Application
```bash
./start.sh
```

Open browser: **http://localhost:5173**

### 5. Stop Application
```bash
./stop.sh
```
Or press **Ctrl+C** if using `./start.sh`

---

## Auto-Start on Boot

```bash
# Copy service file
sudo cp grocery-store.service /etc/systemd/system/

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable grocery-store.service
sudo systemctl start grocery-store.service

# Check status
sudo systemctl status grocery-store.service
```

---

## First Time Usage

1. **Register Seller Account**
   - Go to http://localhost:5173
   - Click "Register here"
   - Select "Seller" role
   - Login

2. **Add Products**
   - Go to Products section
   - Click "+ Add Product"
   - Fill details and upload image

3. **Register Buyer Account**
   - Logout (or use incognito)
   - Register with "Buyer" role
   - Login

4. **Shop**
   - Browse products
   - Add to cart
   - Checkout with delivery address

---

## Troubleshooting

**Port in use:**
```bash
./stop.sh
```

**Module errors:**
```bash
cd server && npm install
cd ../client && npm install
```

**Database errors:**
```bash
cd server
rm database.sqlite
node server.js
```

**Clear cart:**
Press F12 in browser, paste in console:
```javascript
localStorage.clear(); location.reload();
```

---

**Full documentation:** See README.md
