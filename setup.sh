#!/bin/bash

echo "🎯 Heen Coffee POS - Setup Script"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start Docker containers
echo "📦 Starting Docker containers..."
docker-compose up -d

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 10

# Install Composer dependencies
echo "📥 Installing Composer dependencies..."
docker-compose exec -T app composer install

# Install Sanctum
echo "🔐 Installing Laravel Sanctum..."
docker-compose exec -T app composer require laravel/sanctum

# Publish Sanctum config
echo "📄 Publishing Sanctum configuration..."
docker-compose exec -T app php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Run migrations and seeders
echo "🗄️  Running database migrations and seeders..."
docker-compose exec -T app php artisan migrate:fresh --seed

# Set permissions
echo "🔒 Setting permissions..."
docker-compose exec -T app chown -R www-data:www-data /var/www/storage
docker-compose exec -T app chown -R www-data:www-data /var/www/bootstrap/cache

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access Points:"
echo "   - API: http://localhost:8000"
echo "   - phpMyAdmin: http://localhost:8080"
echo ""
echo "🔐 Default Accounts:"
echo "   - Admin: admin@heencoffee.com / admin"
echo "   - Cashier: cashier@heencoffee.com / cashier"
echo ""
echo "🧪 Test Login:"
echo "   curl -X POST http://localhost:8000/api/login \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"email\":\"admin@heencoffee.com\",\"password\":\"admin\"}'"
echo ""
