import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, BarChart3, LogOut, Receipt, Grid, Tag, Plus, Moon, Sun } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { Login } from './pages/Login';
import { Sales } from './pages/Sales';
import { Orders } from './pages/Orders';
import { Inventory } from './pages/Inventory';
import { AdminDashboard } from './pages/AdminDashboard';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Toppings } from './pages/Toppings';

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return <>{children}</>;
  }

  const isAdmin = user.role === 'admin';

  return (
    <div className={`flex h-screen ${dark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`w-64 text-white ${dark ? 'bg-gray-900' : 'bg-gradient-to-b from-[#FF9D6F] to-[#FF7B47]'}`}>
        <div className="p-6 border-b border-white border-opacity-20">
            <div className="flex items-center space-x-3">
              <img
                src="/mynewlogo.png"
                alt="App Logo"
                className="w-20 h-20 object-contain rounded-full border border-white/20"
                style={{ background: dark ? 'rgba(31,41,55,0.6)' : 'rgba(255,255,255,0.12)' }}
              />
              <div>
                <h1 className="font-bold text-lg">KEIMHEAN COFFEE</h1>
                <p className="text-xs text-white text-opacity-80">Chom Chao Center</p>
              </div>
            </div>
            <button
              onClick={toggle}
              className="mt-4 flex items-center space-x-2 text-xs px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            to="/sales"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Sales</span>
          </Link>

          <Link
            to="/orders"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <Receipt className="w-5 h-5" />
            <span>Orders</span>
          </Link>

          {isAdmin && (
            <>
              <Link
                to="/products"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Grid className="w-5 h-5" />
                <span>Products</span>
              </Link>

              <Link
                to="/categories"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Tag className="w-5 h-5" />
                <span>Categories</span>
              </Link>

              <Link
                to="/toppings"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Toppings</span>
              </Link>

              <Link
                to="/inventory"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>Inventory</span>
              </Link>

              <Link
                to="/admin"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 w-64 p-4 border-t border-white border-opacity-20">
          <div className="mb-3 px-4">
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-white text-opacity-70 capitalize">{user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/sales" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/sales"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Sales />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <AppLayout>
                    <Orders />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/products"
              element={
                <PrivateRoute adminOnly>
                  <AppLayout>
                    <Products />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/categories"
              element={
                <PrivateRoute adminOnly>
                  <AppLayout>
                    <Categories />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/toppings"
              element={
                <PrivateRoute adminOnly>
                  <AppLayout>
                    <Toppings />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute adminOnly>
                  <AppLayout>
                    <Inventory />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/sales" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
