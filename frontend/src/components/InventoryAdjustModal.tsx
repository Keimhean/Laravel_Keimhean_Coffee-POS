import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../utils/api';

interface InventoryAdjustModalProps {
  item: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function InventoryAdjustModal({ item, onClose, onSuccess }: InventoryAdjustModalProps) {
  const [type, setType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (quantity <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/inventory/${item.id}/adjust`, {
        type,
        quantity,
        notes: notes || undefined,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to adjust inventory');
    } finally {
      setLoading(false);
    }
  };

  const newQuantity = type === 'in' 
    ? item.quantity + quantity 
    : Math.max(0, item.quantity - quantity);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Adjust Inventory</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <div className="text-sm text-gray-500">Item</div>
            <div className="text-lg font-semibold">{item.name}</div>
            <div className="text-sm text-gray-500 mt-1">
              Current Stock: {item.quantity} {item.unit}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('in')}
                className={`py-3 rounded-lg border-2 transition-colors font-medium ${
                  type === 'in'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Stock In
              </button>
              <button
                onClick={() => setType('out')}
                className={`py-3 rounded-lg border-2 transition-colors font-medium ${
                  type === 'out'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Stock Out
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity ({item.unit})</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9D6F] focus:border-transparent resize-none"
              placeholder="Reason for adjustment..."
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">New Stock Level</span>
              <span className={`text-xl font-bold ${
                newQuantity <= item.reorder_level ? 'text-red-500' : 'text-green-600'
              }`}>
                {newQuantity} {item.unit}
              </span>
            </div>
            {newQuantity <= item.reorder_level && (
              <div className="mt-2 text-xs text-red-600">
                ⚠️ Below reorder level ({item.reorder_level} {item.unit})
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            disabled={loading || quantity <= 0}
            className="w-full py-3 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm Adjustment'}
          </button>
        </div>
      </div>
    </div>
  );
}
