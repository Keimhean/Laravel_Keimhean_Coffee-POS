# ✅ Installation Checklist - Heen Coffee POS

## 📋 Pre-Installation

- [ ] Docker Desktop installed and running
- [ ] Terminal/Command Prompt ready
- [ ] Port 8000 available (for API)
- [ ] Port 8080 available (for phpMyAdmin)
- [ ] Port 3306 available (for MySQL)

---

## 🚀 Installation Steps

### Option 1: Automated Setup (Recommended)

- [ ] Navigate to project directory
  ```bash
  cd /Users/macbook/Desktop/myproject
  ```

- [ ] Run setup script
  ```bash
  ./setup.sh
  ```

- [ ] Wait for completion (2-3 minutes)

### Option 2: Manual Setup

- [ ] Start Docker containers
  ```bash
  docker-compose up -d
  ```

- [ ] Install Composer dependencies
  ```bash
  docker-compose exec app composer install
  ```

- [ ] Install Sanctum
  ```bash
  docker-compose exec app composer require laravel/sanctum
  ```

- [ ] Publish Sanctum config
  ```bash
  docker-compose exec app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
  ```

- [ ] Run migrations and seed
  ```bash
  docker-compose exec app php artisan migrate:fresh --seed
  ```

- [ ] Fix permissions
  ```bash
  docker-compose exec app chown -R www-data:www-data /var/www/storage
  docker-compose exec app chown -R www-data:www-data /var/www/bootstrap/cache
  ```

---

## ✅ Verification

- [ ] Check Docker containers are running
  ```bash
  docker-compose ps
  ```
  Expected: 4 containers (app, nginx, db, phpmyadmin)

- [ ] Test API endpoint
  ```bash
  curl http://localhost:8000/api/login -X POST \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@heencoffee.com","password":"admin"}'
  ```
  Expected: JSON with success=true and token

- [ ] Open phpMyAdmin
  - URL: http://localhost:8080
  - Server: `db`
  - Username: `heen_user`
  - Password: `heen_password`
  Expected: Access to database with 9 tables

- [ ] Check database tables exist
  ```bash
  docker-compose exec app php artisan migrate:status
  ```
  Expected: All migrations marked as "Ran"

---

## 📊 Database Verification

- [ ] Categories table has 5 records
- [ ] Products table has 6 records
- [ ] Toppings table has 7 records
- [ ] Users table has 3 records
- [ ] Inventory_items table has 10 records

---

## 🧪 API Testing

- [ ] Login works (POST /api/login)
- [ ] Get products works (GET /api/products)
- [ ] Get categories works (GET /api/categories)
- [ ] Get toppings works (GET /api/toppings)
- [ ] Create order works (POST /api/orders)

---

## 📁 Files Created

### Docker Configuration
- [ ] docker-compose.yml
- [ ] Dockerfile
- [ ] docker/nginx/nginx.conf

### Migrations (7 files)
- [ ] categories table migration
- [ ] products table migration
- [ ] toppings table migration
- [ ] orders table migration
- [ ] order_items table migration
- [ ] inventory tables migration
- [ ] users table update migration

### Models (8 files)
- [ ] Category.php
- [ ] Product.php
- [ ] Topping.php
- [ ] Order.php
- [ ] OrderItem.php
- [ ] InventoryItem.php
- [ ] InventoryLog.php
- [ ] User.php (updated)

### Controllers (6 files)
- [ ] AuthController.php
- [ ] CategoryController.php
- [ ] ProductController.php
- [ ] ToppingController.php
- [ ] OrderController.php
- [ ] InventoryController.php

### Seeders (6 files)
- [ ] DatabaseSeeder.php
- [ ] UserSeeder.php
- [ ] CategorySeeder.php
- [ ] ToppingSeeder.php
- [ ] ProductSeeder.php
- [ ] InventorySeeder.php

### Routes
- [ ] routes/api.php (25 endpoints)

### Documentation
- [ ] README.md
- [ ] QUICKSTART.md
- [ ] PROJECT_SUMMARY.md
- [ ] API_EXAMPLES.md
- [ ] CHECKLIST.md (this file)

### Setup
- [ ] setup.sh (executable)
- [ ] .env (configured)

---

## 🎯 Final Verification

- [ ] All 4 Docker containers running
- [ ] API accessible at http://localhost:8000
- [ ] phpMyAdmin accessible at http://localhost:8080
- [ ] Login API returns token
- [ ] Sample data loaded successfully
- [ ] No errors in container logs

Check logs:
```bash
docker-compose logs -f app
```

---

## 🐛 Troubleshooting

### If containers won't start:
```bash
docker-compose down
docker-compose up -d
```

### If database connection fails:
```bash
docker-compose restart db
sleep 10
docker-compose exec app php artisan migrate:fresh --seed
```

### If permission errors:
```bash
docker-compose exec app chown -R www-data:www-data /var/www/storage
docker-compose exec app chown -R www-data:www-data /var/www/bootstrap/cache
docker-compose exec app chmod -R 775 storage
docker-compose exec app chmod -R 775 bootstrap/cache
```

### View container logs:
```bash
# App logs
docker-compose logs -f app

# Database logs
docker-compose logs -f db

# Nginx logs
docker-compose logs -f nginx
```

---

## 📚 Reference Documents

After installation, refer to:

1. **README.md** - Complete documentation
2. **QUICKSTART.md** - Quick setup guide
3. **API_EXAMPLES.md** - API testing examples
4. **PROJECT_SUMMARY.md** - Project overview

---

## ✅ Success Criteria

Your installation is successful when:

✅ All 4 Docker containers show "Up" status
✅ Login API returns a valid token
✅ phpMyAdmin shows 9 database tables
✅ GET /api/products returns 6 products
✅ GET /api/categories returns 5 categories
✅ No errors in docker-compose logs

---

## 🎉 Ready to Go!

Once all items are checked:

1. Start building your frontend
2. Test all API endpoints
3. Customize products and categories
4. Add more features as needed

**Your Heen Coffee POS backend is complete! 🚀**
