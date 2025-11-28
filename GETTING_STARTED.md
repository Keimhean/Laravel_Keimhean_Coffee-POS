# 🚀 Heen Coffee POS - Getting Started Guide

Welcome to the Heen Coffee Point of Sale system! This guide will help you get the entire system up and running in minutes.

## 📋 What You'll Get

A complete, production-ready POS system with:
- ✅ **Laravel 11 Backend** - RESTful API with 25 endpoints
- ✅ **React 18 Frontend** - Modern, responsive UI
- ✅ **MySQL Database** - With sample data
- ✅ **Docker Setup** - Easy deployment
- ✅ **Role-Based Access** - Admin & Cashier roles
- ✅ **Full POS Features** - Sales, orders, inventory, analytics

---

## ⚡ Quick Installation (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ installed

### One-Command Setup

```bash
# Navigate to project directory
cd /Users/macbook/Desktop/myproject

# Run the installation script
./install.sh
```

That's it! The script will:
1. Start Docker containers (Laravel, MySQL, Nginx, phpMyAdmin)
2. Install all dependencies
3. Set up the database
4. Seed sample data
5. Configure everything

After installation completes:

```bash
# Start the frontend
cd frontend
npm run dev
```

Then open http://localhost:3000 in your browser!

---

## 🔐 Login & First Steps

### Admin Login
- **Email:** admin@heencoffee.com
- **Password:** admin

**Admin can:**
- Process sales
- View orders
- Manage inventory
- View analytics dashboard

### Cashier Login
- **Email:** cashier@heencoffee.com
- **Password:** cashier

**Cashier can:**
- Process sales
- View orders

### Try Your First Order

1. Login with admin credentials
2. You'll land on the **Sales** page
3. Search or browse products (e.g., "Cappuccino")
4. Click a product card
5. Customize:
   - Size: Small or Large (+30%)
   - Temperature: Hot or Cold
   - Add toppings (optional)
   - Set quantity
6. Click "Add to Cart"
7. See your cart on the right sidebar
8. Click "Checkout"
9. Enter customer name (e.g., "John Doe")
10. Select payment method (Cash or Card)
11. Click "Complete Order"

✅ Done! Order created successfully.

---

## 📍 System URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | React UI (main interface) |
| **Backend API** | http://localhost:8000 | Laravel API |
| **phpMyAdmin** | http://localhost:8080 | Database management |

---

## 🗄️ Database Access

### Via phpMyAdmin
1. Go to http://localhost:8080
2. Login:
   - **Server:** mysql
   - **Username:** heen_user
   - **Password:** heen_password
3. Select database: `heen_coffee_db`

### Direct MySQL Access
```bash
docker-compose exec mysql mysql -u heen_user -pheen_password heen_coffee_db
```

---

## 📊 Sample Data Included

Your system comes pre-loaded with:

### Users (3)
- 1 Admin (full access)
- 2 Cashiers (limited access)

### Products (6)
- Espresso ($3.50)
- Cappuccino ($4.50)
- Green Tea Latte ($4.00)
- Mango Smoothie ($5.50)
- Chocolate Cake ($6.00)
- Croissant ($3.00)

### Categories (5)
- Coffee
- Non-Coffee Drinks
- Smoothies
- Desserts
- Snacks

### Toppings (7)
- Whipped Cream (+$0.50)
- Extra Shot (+$1.00)
- Caramel Syrup (+$0.75)
- Vanilla Syrup (+$0.75)
- Chocolate Drizzle (+$0.50)
- Pearl (+$1.00)
- Almond Milk (+$0.50)

### Inventory Items (10)
- Coffee Beans, Milk, Sugar, Tea Powder, etc.
- Each with reorder levels and alerts

---

## 🎯 Feature Walkthrough

### 1. Sales Page (Main POS Interface)

**Location:** http://localhost:3000/sales

**Features:**
- **Search Bar** - Type product name to filter
- **Category Filter** - Click category buttons to filter
- **Product Grid** - Browse all products
- **Product Card** - Shows name, price, category
- **Customization Modal** - Opens when clicking a product
- **Shopping Cart** - Right sidebar shows current order
- **Checkout Button** - Process payment

**Try This:**
1. Search "coffee" - see only coffee products
2. Click "Non-Coffee" category - see tea, etc.
3. Click "Cappuccino"
4. Select "Large" (price increases 30%)
5. Select "Hot"
6. Add "Whipped Cream" (+$0.50)
7. Set quantity to 2
8. See total: $10.00 (($4.50 × 1.3 + $0.50) × 2)
9. Add to cart
10. Checkout!

### 2. Orders Page

**Location:** http://localhost:3000/orders

**Features:**
- Order history table
- Search by order ID or customer name
- View order details (click "View" button)
- Order status badges (completed/pending/cancelled)

**Try This:**
1. After creating an order on Sales page
2. Go to Orders page
3. Search your customer name
4. Click "View" to see order details
5. See all items, customizations, totals

### 3. Inventory Page (Admin Only)

**Location:** http://localhost:3000/inventory

**Features:**
- Inventory items grid
- Low stock alerts (red cards)
- Stock adjustment
- Reorder level tracking

**Try This:**
1. Login as admin
2. Go to Inventory
3. Find "Coffee Beans" (5000g current stock)
4. Click "Adjust Stock"
5. Select "Stock Out"
6. Enter quantity: 1000
7. Add note: "Used for morning rush"
8. Confirm
9. See new stock level: 4000g

### 4. Admin Dashboard

**Location:** http://localhost:3000/admin

**Features:**
- Revenue metrics
- Order statistics
- Sales trend chart (7 days)
- Top products chart
- Recent orders table

**Try This:**
1. Login as admin
2. Go to Admin Dashboard
3. View total revenue card
4. Check sales trend line chart
5. See which products are best sellers
6. Review recent transactions

---

## 🛠️ Common Operations

### Stop the Backend
```bash
docker-compose down
```

### Start the Backend
```bash
docker-compose up -d
```

### View Backend Logs
```bash
# All services
docker-compose logs -f

# Just Laravel app
docker-compose logs -f app

# Just MySQL
docker-compose logs -f mysql
```

### Access Laravel Container
```bash
docker-compose exec app bash

# Then you can run artisan commands
php artisan migrate
php artisan db:seed
php artisan route:list
```

### Reset Database
```bash
docker-compose exec app php artisan migrate:fresh --seed
```

### Clear Laravel Cache
```bash
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan route:clear
```

### Rebuild Docker Containers
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📱 Testing the API Directly

### Test Authentication
```bash
# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@heencoffee.com",
    "password": "admin"
  }'

# Response includes token:
# {"token":"1|xxxxx","user":{...}}
```

### Test Product Listing
```bash
# Get all products (with token)
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Create Order
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "customer_name": "Test Customer",
    "payment_method": "cash",
    "items": [{
      "product_id": 1,
      "quantity": 2,
      "size": "Large",
      "temperature": "Hot",
      "toppings": [1, 2],
      "subtotal": 10.00
    }],
    "total": 10.00
  }'
```

---

## 🔧 Customization

### Change Brand Colors

**Frontend** (`frontend/tailwind.config.js`):
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF9D6F', // Change this
      }
    }
  }
}
```

Also update gradients in components:
```jsx
// Find and replace in all component files
className="bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47]"
// With your new colors
```

### Change API URL

**Frontend** (`frontend/src/utils/api.ts`):
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Change this
});
```

### Add New Product

**Via API:**
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Iced Latte",
    "description": "Cold milk with espresso",
    "category_id": 1,
    "price": 4.50,
    "has_size": true,
    "has_temperature": true
  }'
```

**Via Database Seeder:**
Edit `database/seeders/ProductSeeder.php`, add product, then:
```bash
docker-compose exec app php artisan db:seed --class=ProductSeeder
```

---

## 🐛 Troubleshooting

### Issue: Docker containers won't start

**Solution:**
```bash
# Stop everything
docker-compose down

# Remove volumes (caution: deletes data)
docker-compose down -v

# Rebuild and start
docker-compose up -d --build
```

### Issue: "Permission denied" errors

**Solution:**
```bash
# Fix Laravel storage permissions
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### Issue: MySQL connection failed

**Solution:**
```bash
# Wait for MySQL to fully start (takes ~30 seconds)
sleep 30

# Check MySQL logs
docker-compose logs mysql

# Verify connection
docker-compose exec app php artisan migrate:status
```

### Issue: Frontend CORS errors

**Solution:**
Check `config/cors.php` in Laravel:
```php
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

Then restart backend:
```bash
docker-compose restart app
```

### Issue: "Token mismatch" or auth not working

**Solution:**
```bash
# Frontend: Clear localStorage
# Open browser console and run:
localStorage.clear()

# Then login again
```

### Issue: Frontend build fails

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Port already in use

**Solution:**
```bash
# Check what's using the port
lsof -i :8000   # Backend
lsof -i :3000   # Frontend
lsof -i :3306   # MySQL
lsof -i :8080   # phpMyAdmin

# Kill the process or change port in docker-compose.yml
```

---

## 📚 Additional Documentation

- **COMPLETE_PROJECT_SUMMARY.md** - Full project overview
- **API_EXAMPLES.md** - API endpoint examples
- **frontend/README.md** - Frontend-specific guide
- **QUICKSTART.md** - Quick reference

---

## ✅ Quick Checklist

Before going live, ensure:

- [ ] Backend running: `docker-compose ps` shows all UP
- [ ] Database migrated: `docker-compose exec app php artisan migrate:status`
- [ ] Sample data loaded: Login and see products
- [ ] Frontend running: `npm run dev` in frontend folder
- [ ] Can login as admin: admin@heencoffee.com / admin
- [ ] Can login as cashier: cashier@heencoffee.com / cashier
- [ ] Can create order on Sales page
- [ ] Can view orders on Orders page
- [ ] Admin can access Inventory page
- [ ] Admin can access Dashboard page
- [ ] phpMyAdmin accessible at port 8080

---

## 🎓 Learning Resources

### Want to customize further?

**Backend (Laravel):**
- Laravel Docs: https://laravel.com/docs
- Laravel Sanctum: https://laravel.com/docs/sanctum
- Eloquent ORM: https://laravel.com/docs/eloquent

**Frontend (React):**
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Vite: https://vitejs.dev/guide

**Docker:**
- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose

---

## 🎉 You're Ready!

Your complete POS system is set up and ready to use. Start processing orders, managing inventory, and growing your coffee shop!

**Need help?** Check the documentation files or review the code comments.

**Happy coding!** ☕

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start backend | `docker-compose up -d` |
| Stop backend | `docker-compose down` |
| Start frontend | `cd frontend && npm run dev` |
| View logs | `docker-compose logs -f` |
| Reset DB | `docker-compose exec app php artisan migrate:fresh --seed` |
| Access Laravel | `docker-compose exec app bash` |
| Build frontend | `cd frontend && npm run build` |

**Ports:**
- Frontend: 3000
- Backend: 8000
- phpMyAdmin: 8080
- MySQL: 3306

**Default Credentials:**
- Admin: admin@heencoffee.com / admin
- Cashier: cashier@heencoffee.com / cashier
- DB: heen_user / heen_password
