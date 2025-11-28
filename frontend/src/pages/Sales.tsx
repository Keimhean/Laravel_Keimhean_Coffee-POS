import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductGrid } from '../components/ProductGrid';
import { Cart } from '../components/Cart';
import { ProductCustomizationModal } from '../components/ProductCustomizationModal.tsx';
import { CheckoutModal } from '../components/CheckoutModal';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

export function Sales() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { addItem, items } = useCart();
  const { dark } = useTheme();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category_id === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const products = response.data.data || response.data;
      setProducts(products);
      setFilteredProducts(products);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  };

  const handleAddToCart = (customization: any) => {
    addItem(customization);
    setSelectedProduct(null);
  };

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className={`${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${dark ? 'text-gray-100' : 'text-gray-800'}`}>Sales</h1>
          <div className={`flex items-center space-x-2 text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
            <ShoppingBag className="w-4 h-4" />
            <span>{items.length} items in cart</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Products Section */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className={`p-6 space-y-4 border-b ${dark ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-transparent'}`}>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          <div className={`flex-1 overflow-y-auto p-6 ${dark ? 'bg-gray-950' : ''}`}>
            <ProductGrid
              products={filteredProducts}
            />
          </div>
        </div>

        {/* Cart Section */}
        <div className={`w-96 flex flex-col ${dark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-l`}>
          <div className={`px-4 py-4 border-b ${dark ? 'border-gray-800' : 'border-gray-200'}`}>
            <h2 className={`text-lg font-semibold ${dark ? 'text-gray-100' : 'text-gray-900'}`}>Current Order</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <Cart />
          </div>
          <div className={`p-4 border-t ${dark ? 'border-gray-800' : 'border-gray-200'}`}>
            <button
              onClick={() => setShowCheckout(true)}
              disabled={items.length === 0}
              className="w-full py-3 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {selectedProduct && (
        <ProductCustomizationModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleAddToCart}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            alert('Order completed successfully!');
          }}
        />
      )}
    </div>
  );
}
