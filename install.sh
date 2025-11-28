#!/bin/bash

# Heen Coffee POS System - Complete Installation Script
# This script sets up both backend and frontend

echo "=========================================="
echo "Heen Coffee POS - Complete Installation"
echo "=========================================="
echo ""

# Get the directory where this script is located
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "📁 Project directory: $PROJECT_DIR"
echo ""

# Check prerequisites
echo "Checking prerequisites..."
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed!"
    echo "Please install Docker from https://www.docker.com/"
    exit 1
fi
echo "✅ Docker: $(docker --version)"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed!"
    echo "Please install Docker Compose"
    exit 1
fi
echo "✅ Docker Compose: $(docker-compose --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js: $(node -v)"
echo ""

# BACKEND SETUP
echo "=========================================="
echo "STEP 1: Setting up Backend (Laravel)"
echo "=========================================="
echo ""

cd "$PROJECT_DIR"

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found in project root!"
    echo "Make sure you're in the correct directory"
    exit 1
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Failed to start Docker containers"
    exit 1
fi

echo "⏳ Waiting for MySQL to be ready (30 seconds)..."
sleep 30

# Install Composer dependencies
echo "📦 Installing Composer dependencies..."
docker-compose exec app composer install

# Generate application key
echo "🔑 Generating application key..."
docker-compose exec app php artisan key:generate

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec app php artisan migrate --force

# Seed database
echo "🌱 Seeding database with sample data..."
docker-compose exec app php artisan db:seed --force

# Clear and cache config
echo "🧹 Clearing and caching configuration..."
docker-compose exec app php artisan config:cache
docker-compose exec app php artisan route:cache

echo ""
echo "✅ Backend setup complete!"
echo ""

# FRONTEND SETUP
echo "=========================================="
echo "STEP 2: Setting up Frontend (React)"
echo "=========================================="
echo ""

cd "$PROJECT_DIR/frontend"

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in frontend directory!"
    exit 1
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install npm dependencies"
    exit 1
fi

echo ""
echo "✅ Frontend setup complete!"
echo ""

# COMPLETION MESSAGE
cd "$PROJECT_DIR"

echo "=========================================="
echo "🎉 Installation Complete!"
echo "=========================================="
echo ""
echo "Your Heen Coffee POS system is ready!"
echo ""
echo "📍 URLs:"
echo "  - Frontend:    http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - phpMyAdmin:  http://localhost:8080"
echo ""
echo "🔐 Login Credentials:"
echo "  Admin:"
echo "    Email: admin@heencoffee.com"
echo "    Password: admin"
echo ""
echo "  Cashier:"
echo "    Email: cashier@heencoffee.com"
echo "    Password: cashier"
echo ""
echo "📊 Database Access (phpMyAdmin):"
echo "  Server: mysql"
echo "  Username: heen_user"
echo "  Password: heen_password"
echo "  Database: heen_coffee_db"
echo ""
echo "🚀 To start using the system:"
echo ""
echo "1. Start the frontend development server:"
echo "   cd frontend && npm run dev"
echo ""
echo "2. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo "3. Login with credentials above"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start:        QUICKSTART.md"
echo "  - Project Summary:    COMPLETE_PROJECT_SUMMARY.md"
echo "  - API Examples:       API_EXAMPLES.md"
echo "  - Frontend Guide:     frontend/README.md"
echo ""
echo "💡 Useful Commands:"
echo ""
echo "Backend:"
echo "  docker-compose up -d          Start backend"
echo "  docker-compose down           Stop backend"
echo "  docker-compose logs -f app    View Laravel logs"
echo "  docker-compose exec app bash  Access Laravel container"
echo ""
echo "Frontend:"
echo "  npm run dev     Start dev server"
echo "  npm run build   Build for production"
echo ""
echo "=========================================="
echo "Happy coding! ☕"
echo "=========================================="
