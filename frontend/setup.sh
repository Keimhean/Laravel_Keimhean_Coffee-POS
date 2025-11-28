#!/bin/bash

# Heen Coffee POS Frontend - Quick Start Script
# This script sets up and runs the React frontend

echo "======================================"
echo "Heen Coffee POS - Frontend Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Navigate to frontend directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "======================================"
echo "Frontend is ready!"
echo "======================================"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The frontend will be available at:"
echo "  http://localhost:3000"
echo ""
echo "Login credentials:"
echo "  Admin: admin@heencoffee.com / admin"
echo "  Cashier: cashier@heencoffee.com / cashier"
echo ""
echo "Make sure the backend API is running at:"
echo "  http://localhost:8000"
echo ""
