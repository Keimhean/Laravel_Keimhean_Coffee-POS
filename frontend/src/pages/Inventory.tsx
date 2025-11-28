import { useState, useEffect } from 'react';
import { Search, Plus, AlertTriangle } from 'lucide-react';
import { InventoryAdjustModal } from '../components/InventoryAdjustModal';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

export function Inventory() {
  const { dark } = useTheme();
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchQuery]);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory');
      const items = response.data.data || response.data;
      setItems(items);
      setFilteredItems(items);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`h-screen flex flex-col ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <h1 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-gray-800'}`}>Inventory Management</h1>
      </div>

      <div className="p-6">
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search inventory items..."
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent ${dark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>

        {loading ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading inventory...</div>
        ) : filteredItems.length === 0 ? (
          <div className={`text-center py-12 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No inventory items found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const isLowStock = item.quantity <= item.reorder_level;
              return (
                <div
                  key={item.id}
                  className={`rounded-lg shadow p-6 border-2 transition-colors ${
                    isLowStock 
                      ? dark ? 'border-red-500 bg-red-900/20' : 'border-red-300 bg-red-50'
                      : dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className={`font-semibold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>{item.name}</h3>
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{item.category}</p>
                    </div>
                    {isLowStock && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>Current Stock</span>
                      <span className={`font-semibold ${isLowStock ? 'text-red-500' : dark ? 'text-white' : 'text-gray-800'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>Reorder Level</span>
                      <span className={`${dark ? 'text-white' : 'text-gray-800'}`}>{item.reorder_level} {item.unit}</span>
                    </div>
                    {item.supplier && (
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${dark ? 'text-gray-400' : 'text-gray-600'}`}>Supplier</span>
                        <span className={`${dark ? 'text-white' : 'text-gray-800'}`}>{item.supplier}</span>
                      </div>
                    )}
                  </div>

                  {isLowStock && (
                    <div className={`mb-4 p-3 border rounded-lg ${dark ? 'bg-red-900/30 border-red-700' : 'bg-red-100 border-red-200'}`}>
                      <p className={`text-xs font-medium ${dark ? 'text-red-400' : 'text-red-700'}`}>
                        ⚠️ Low stock alert! Please reorder soon.
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="w-full py-2 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adjust Stock</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedItem && (
        <InventoryAdjustModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onSuccess={fetchInventory}
        />
      )}
    </div>
  );
}
