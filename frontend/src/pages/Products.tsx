import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

interface Product {
  id: number;
  name: string;
  description: string;
  // Laravel decimal cast returns string; normalize for UI
  price: number | string;
  category_id: number;
  category?: { id: number; name: string };
  image?: string;
  is_active: boolean;
}

interface Category {
  id: number;
  name: string;
}

export function Products() {
  const { dark } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image: '',
    is_active: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchQuery]);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      const raw = response?.data?.data ?? response?.data ?? [];
      const list: Product[] = Array.isArray(raw)
        ? raw.map((p: any) => ({
            ...p,
            price: Number(p.price),
            is_active: Boolean(p.is_active),
          }))
        : [];
      setProducts(list);
      setFilteredProducts(list);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      const data = response.data.data || response.data;
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, {
          ...formData,
          price: parseFloat(formData.price),
          category_id: Number(formData.category_id),
          is_active: Boolean(formData.is_active),
        });
      } else {
        await api.post('/products', {
          ...formData,
          price: parseFloat(formData.price),
          category_id: Number(formData.category_id),
          is_active: Boolean(formData.is_active),
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id.toString(),
      image: product.image || '',
      is_active: Boolean(product.is_active),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image: '',
      status: 'available',
    });
  };

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Products Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>

        {loading ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No products found</div>
        ) : (
          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={`${dark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Name</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Category</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Price</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Status</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className={`${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{product.name}</div>
                      <div className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{product.description}</div>
                    </td>
                    <td className={`px-6 py-4 text-sm ${dark ? 'text-gray-300' : 'text-gray-900'}`}>{product.category?.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#FF9D6F]">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.is_active ? 'available' : 'unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full p-6`}>
            <h2 className={`text-xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                  rows={3}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Price</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                <select
                  value={formData.is_active ? 'available' : 'unavailable'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.value === 'available',
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={`flex-1 px-4 py-2 border rounded-lg ${dark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg hover:shadow-lg transition-all"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
