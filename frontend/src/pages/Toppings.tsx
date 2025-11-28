import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

interface Topping {
  id: number;
  name: string;
  // Backend may return decimal as string; normalize to number in state
  price: number | string;
}

export function Toppings() {
  const { dark } = useTheme();
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  });

  useEffect(() => {
    fetchToppings();
  }, []);

  const fetchToppings = async () => {
    try {
      const response = await api.get('/toppings');
      // API typically returns { success, data: [...] }
      const raw = response?.data?.data ?? response?.data ?? [];
      const list: Topping[] = Array.isArray(raw)
        ? raw.map((t: any) => ({
            ...t,
            price: Number(t.price),
          }))
        : [];
      setToppings(list);
    } catch (error) {
      console.error('Failed to fetch toppings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTopping) {
        await api.put(`/toppings/${editingTopping.id}`, {
          ...formData,
          price: parseFloat(formData.price),
        });
      } else {
        await api.post('/toppings', {
          ...formData,
          price: parseFloat(formData.price),
        });
      }
      fetchToppings();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save topping', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this topping?')) return;
    try {
      await api.delete(`/toppings/${id}`);
      fetchToppings();
    } catch (error) {
      console.error('Failed to delete topping', error);
    }
  };

  const handleEdit = (topping: Topping) => {
    setEditingTopping(topping);
    setFormData({
      name: topping.name,
      price: String(topping.price),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTopping(null);
    setFormData({ name: '', price: '' });
  };

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4 flex items-center justify-between`}>
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Toppings Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Topping</span>
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading toppings...</div>
        ) : toppings.length === 0 ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No toppings found</div>
        ) : (
          <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
            <table className="w-full">
              <thead className={`${dark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b`}>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Name</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Price</th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${dark ? 'text-gray-300' : 'text-gray-500'} uppercase`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {toppings.map((topping) => (
                  <tr key={topping.id} className={`${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <td className={`px-6 py-4 text-sm font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{topping.name}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#FF9D6F]">
                      ${Number(topping.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEdit(topping)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(topping.id)}
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
              {editingTopping ? 'Edit Topping' : 'Add Topping'}
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
                  {editingTopping ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
