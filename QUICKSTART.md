# 🚀 Quick Setup Guide - Heen Coffee POS

## One-Command Setup (Recommended)

```bash
./setup.sh
```

This will automatically:
- Start Docker containers
- Install dependencies
- Run migrations
- Seed sample data
- Set permissions

---

## Manual Setup

### 1. Start Docker
```bash
docker-compose up -d
```

### 2. Install Dependencies
```bash
docker-compose exec app composer install
docker-compose exec app composer require laravel/sanctum
```

### 3. Setup Database
```bash
docker-compose exec app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
docker-compose exec app php artisan migrate:fresh --seed
```

### 4. Fix Permissions
```bash
docker-compose exec app chown -R www-data:www-data /var/www/storage
docker-compose exec app chown -R www-data:www-data /var/www/bootstrap/cache
```

---

## 🌐 URLs

- **API**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080

## 🔐 Login Credentials

| User | Email | Password |
|------|-------|----------|
| Admin | admin@heencoffee.com | admin |
| Cashier | cashier@heencoffee.com | cashier |

---

## 🧪 Test API

### 1. Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@heencoffee.com","password":"admin"}'
```

Save the token from the response.

### 2. Get Products
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Create Order
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "user_id": 1,
    "order_type": "dine-in",
    "payment_method": "cash",
    "items": [
      {
        "product_id": 1,
        "size": "Large",
        "temperature": "Hot",
        "quantity": 2,
        "toppings": [{"id": 1}, {"id": 2}]
      }
    ]
  }'
```

---

## 🛠️ Common Commands

```bash
# View logs
docker-compose logs -f app

# Enter container
docker-compose exec app bash

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Reset database
docker-compose exec app php artisan migrate:fresh --seed
```

---

## 📊 Database Info

**MySQL Connection:**
- Host: `localhost` (or `db` from container)
- Port: `3306`
- Database: `heen_coffee_pos`
- Username: `heen_user`
- Password: `heen_password`

---

## ✅ Verify Installation

Check if everything is running:
```bash
docker-compose ps
```

You should see 4 containers running:
- heen_coffee_app
- heen_coffee_nginx
- heen_coffee_db
- heen_coffee_phpmyadmin

---

## 🎯 What's Included

- ✅ 7 Database tables with relationships
- ✅ REST API with authentication
- ✅ Role-based access control
- ✅ Sample data (products, users, inventory)
- ✅ Docker containerized
- ✅ phpMyAdmin interface
- ✅ Complete CRUD operations

---

**Need help? Check README.md for detailed documentation.**
