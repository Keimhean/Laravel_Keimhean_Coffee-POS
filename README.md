#  HEEN COFFEE POS - Complete Backend Setup
[![C#](https://img.shields.io/badge/C%23-239120?logo=csharp&logoColor=white)](https://learn.microsoft.com/en-us/dotnet/csharp/)
[![PHP](https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=white)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-FF2D20?logo=laravel&logoColor=white)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Docker MySQL phpMyAdmin](https://img.shields.io/badge/Docker_MySQL_phpMyAdmin-2496ED?logo=docker&logoColor=white)](https://hub.docker.com/_/phpmyadmin)

A complete Laravel-based Point of Sale (POS) system for coffee shops with Docker, MySQL, and phpMyAdmin.

##  Features

-  **Authentication**: Role-based access (Admin/Cashier) with Laravel Sanctum
-  **Product Management**: Categories, products, toppings with sizes & temperatures
-  **Order System**: Complete order processing with discount support
-  **Analytics**: Sales reports and top products tracking
-  **Inventory**: Stock management with low-stock alerts
-  **Docker**: Fully containerized with Docker Compose
-  **Database**: MySQL 8.0 with phpMyAdmin interface

##  Quick Start

### Prerequisites
- Docker Desktop installed
- Git (optional)

### Installation Steps

1. **Start Docker Services**
```bash
docker-compose up -d
```

2. **Install Dependencies**
```bash
docker-compose exec app composer install
```

3. **Install Laravel Sanctum** (if not installed)
```bash
docker-compose exec app composer require laravel/sanctum
```

4. **Publish Sanctum Configuration**
```bash
docker-compose exec app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

5. **Run Migrations & Seed Database**
```bash
docker-compose exec app php artisan migrate:fresh --seed
```

6. **Set Permissions** (if needed)
```bash
docker-compose exec app chown -R www-data:www-data /var/www/storage
docker-compose exec app chown -R www-data:www-data /var/www/bootstrap/cache
```

##  Access Points

- **Laravel API**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080
  - Server: `db`
  - Username: `heen_user`
  - Password: `****`

##  Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | xxx@example.com | **** |
| Cashier | xxx@example.com | **** |
| Cashier | xxx@example.com| **** |

##  API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/logout` - User logout (authenticated)
- `GET /api/me` - Get current user (authenticated)

### Products
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Toppings
- `GET /api/toppings` - List toppings
- `POST /api/toppings` - Create topping
- `PUT /api/toppings/{id}` - Update topping
- `DELETE /api/toppings/{id}` - Delete topping

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order
- `PATCH /api/orders/{id}/status` - Update order status
- `GET /api/analytics` - Get sales analytics

### Inventory
- `GET /api/inventory` - List inventory items
- `GET /api/inventory/{id}` - Get inventory item
- `POST /api/inventory` - Create inventory item
- `PUT /api/inventory/{id}` - Update inventory item
- `POST /api/inventory/{id}/adjust` - Adjust stock
- `GET /api/inventory/alerts/low-stock` - Low stock alerts

##  Testing the API

### Login Example
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@heencoffee.com","password":"admin"}'
```

### Get Products (with token)
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

##  Database Schema

### Tables
1. **users** - User accounts with roles
2. **categories** - Product categories
3. **products** - Coffee and food products
4. **toppings** - Product add-ons
5. **product_topping** - Product-topping relationships
6. **orders** - Customer orders
7. **order_items** - Order line items
8. **inventory_items** - Stock items
9. **inventory_logs** - Stock movement history

##  Common Commands

### Docker Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Enter container
docker-compose exec app bash

# Restart services
docker-compose restart
```

### Laravel Commands (inside container)
```bash
# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Fresh migration with seed
php artisan migrate:fresh --seed

# Clear cache
php artisan cache:clear

# Create new migration
php artisan make:migration create_example_table

# Create new controller
php artisan make:controller ExampleController
```

##  Project Structure

```
myproject/
├── app/
│   ├── Http/Controllers/Api/  # API Controllers
│   └── Models/                # Eloquent Models
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── routes/
│   └── api.php               # API routes
├── docker/
│   └── nginx/
│       └── nginx.conf        # Nginx configuration
├── docker-compose.yml        # Docker services
├── Dockerfile                # PHP-FPM container
└── .env                      # Environment variables
```

##  Troubleshooting

### Database Connection Issues
```bash
# Check if database container is running
docker-compose ps

# Restart database
docker-compose restart db

# Check database logs
docker-compose logs db
```

### Permission Issues
```bash
# Fix storage permissions
docker-compose exec app chmod -R 775 storage
docker-compose exec app chmod -R 775 bootstrap/cache
```

### Clear All Caches
```bash
docker-compose exec app php artisan config:clear
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan route:clear
docker-compose exec app php artisan view:clear
```

##  Sample Data

The database includes:
- 3 users (1 admin, 2 cashiers)
- 5 product categories
- 6 coffee products
- 7 toppings
- 10 inventory items

##  Reset Database

To start fresh:
```bash
docker-compose exec app php artisan migrate:fresh --seed
```

##  Next Steps

1. Test the API endpoints using Postman or curl
2. Connect your frontend application
3. Customize the products and categories
4. Add more features as needed

##  Documentation

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Docker Documentation](https://docs.docker.com)

---

**Built with Laravel 11 + MySQL 8.0 + Docker �**
