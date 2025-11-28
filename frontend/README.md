# Heen Coffee POS - Frontend

Modern React + TypeScript frontend for the Heen Coffee Point of Sale system.

## 🚀 Tech Stack

- **React 18.2** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **Lucide React** - Icon library
- **Recharts** - Analytics charts

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SearchBar.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductCustomizationModal.tsx
│   │   ├── Cart.tsx
│   │   ├── CheckoutModal.tsx
│   │   ├── OrderDetailsModal.tsx
│   │   └── InventoryAdjustModal.tsx
│   ├── pages/              # Page components
│   │   ├── Login.tsx       # Authentication page
│   │   ├── Sales.tsx       # Main POS interface
│   │   ├── Orders.tsx      # Order history
│   │   ├── Inventory.tsx   # Stock management (Admin)
│   │   └── AdminDashboard.tsx  # Analytics (Admin)
│   ├── context/            # React Context providers
│   │   ├── AuthContext.tsx    # User authentication state
│   │   └── CartContext.tsx    # Shopping cart state
│   ├── utils/
│   │   └── api.ts          # Axios instance with auth
│   ├── styles/
│   │   └── globals.css     # Global styles & Tailwind
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
├── index.html              # HTML template
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind config
└── postcss.config.js       # PostCSS config
```

## 🎨 Features

### For Cashiers & Admins
- **Sales Page** - Product browsing, cart management, checkout
  - Search products by name
  - Filter by category
  - Customize product (size, temperature, toppings)
  - Real-time cart updates
  - Cash/Card payment options

### For All Users
- **Orders Page** - View order history
  - Search by order ID or customer name
  - View detailed order information
  - Track order status

### Admin Only
- **Inventory Management** - Stock control
  - View all inventory items
  - Low stock alerts
  - Stock in/out adjustments
  - Adjustment history tracking

- **Admin Dashboard** - Business analytics
  - Revenue metrics
  - Order statistics
  - Sales trends (7 days)
  - Top products chart
  - Recent orders table

## 🔧 Installation

### Prerequisites
- Node.js 18+ installed
- Backend API running at `http://localhost:8000`

### Steps

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   ```
   http://localhost:3000
   ```

## 🔐 Login Credentials

### Admin Account
- **Email:** admin@heencoffee.com
- **Password:** admin
- **Access:** All features including inventory and dashboard

### Cashier Account
- **Email:** cashier@heencoffee.com
- **Password:** cashier
- **Access:** Sales and orders only

## 🛠️ Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 API Integration

The frontend connects to the Laravel backend API at `http://localhost:8000/api`

### Authentication
- Uses Laravel Sanctum token authentication
- Token stored in `localStorage` as `auth_token`
- Auto-includes token in all API requests via Axios interceptor

### API Endpoints Used
```
POST   /login                    - User authentication
POST   /logout                   - User logout
GET    /categories               - Fetch all categories
GET    /products                 - Fetch all products with toppings
POST   /orders                   - Create new order
GET    /orders                   - Fetch order history
GET    /inventory                - Fetch inventory items (Admin)
POST   /inventory/{id}/adjust    - Adjust stock (Admin)
GET    /admin/stats              - Dashboard statistics (Admin)
```

## 🎨 Customization

### Theme Colors
Primary color is defined in `tailwind.config.js`:
```javascript
colors: {
  primary: '#FF9D6F', // Heen Coffee orange
}
```

Update gradients in components if changing brand colors:
```jsx
className="bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47]"
```

### API Base URL
Update in `src/utils/api.ts` if backend runs on different host:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});
```

## 📱 Responsive Design

- **Desktop:** Full sidebar navigation
- **Tablet:** Optimized layouts
- **Mobile:** Responsive grids and modals

## 🔒 Role-Based Access

### Routes Protected by Role
- `/sales` - All authenticated users
- `/orders` - All authenticated users
- `/inventory` - Admin only
- `/admin` - Admin only

Non-admin users are redirected to `/sales` if accessing admin routes.

## 🐛 Troubleshooting

### CORS Errors
Ensure Laravel backend has proper CORS configuration in `config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,
```

### Authentication Issues
1. Check if backend API is running
2. Verify CSRF cookie configuration in Laravel
3. Clear localStorage: `localStorage.clear()`
4. Check browser console for errors

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

## 📦 Production Build

```bash
# Build optimized production bundle
npm run build

# Output will be in `dist/` folder
# Deploy to static hosting (Vercel, Netlify, etc.)
```

### Environment Variables
Create `.env` file for production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

Update `src/utils/api.ts`:
```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});
```

## 🤝 Integration with Backend

This frontend is designed to work with the Heen Coffee Laravel backend. Ensure:

1. Backend is running: `docker-compose up -d`
2. Database is migrated and seeded
3. CORS is properly configured
4. Sanctum authentication is enabled

## 📝 License

MIT License - See backend project for full license details.

## 💡 Tips

- Use **React DevTools** for debugging component state
- Check **Network tab** for API request/response debugging
- Use **Redux DevTools** if you add Redux later
- Test with both admin and cashier accounts
- Low stock alerts appear when inventory ≤ reorder level
