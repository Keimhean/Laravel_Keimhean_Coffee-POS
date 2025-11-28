import { useState } from 'react';
import { X, CreditCard, Banknote, Truck, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/api';

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutModal({ onClose, onSuccess }: CheckoutModalProps) {
  const { dark } = useTheme();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [orderType, setOrderType] = useState<'delivery' | 'dine-in' | 'take-away'>('dine-in');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!user) {
      setError('You must be logged in to place an order');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        temperature: item.temperature,
        toppings: item.toppings.map((t) => ({ id: t.id, name: t.name, price: t.price })),
      }));

      const response = await api.post('/orders', {
        user_id: user.id,
        order_type: orderType,
        payment_method: paymentMethod,
        items: orderItems,
      });

      if (response.data.success) {
        clearCart();
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to process order';
      setError(errorMessage);
      console.error('Order error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full`}>
        <div className={`border-b p-4 flex items-center justify-between ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Complete Order</h2>
          <button onClick={onClose} className={`${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}>
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Order Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setOrderType('dine-in')}
                className={`py-3 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${
                  orderType === 'dine-in'
                    ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                    : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <UtensilsCrossed className="w-5 h-5 mb-1" />
                <span className="font-medium text-xs">Dine In</span>
              </button>
              <button
                onClick={() => setOrderType('take-away')}
                className={`py-3 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${
                  orderType === 'take-away'
                    ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                    : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <ShoppingBag className="w-5 h-5 mb-1" />
                <span className="font-medium text-xs">Take Away</span>
              </button>
              <button
                onClick={() => setOrderType('delivery')}
                className={`py-3 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${
                  orderType === 'delivery'
                    ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                    : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Truck className="w-5 h-5 mb-1" />
                <span className="font-medium text-xs">Delivery</span>
              </button>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod('cash')}
                className={`py-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${
                  paymentMethod === 'cash'
                    ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                    : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Banknote className="w-6 h-6 mb-2" />
                <span className="font-medium">Cash</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`py-4 rounded-lg border-2 transition-colors flex flex-col items-center justify-center ${
                  paymentMethod === 'card'
                    ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                    : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <CreditCard className="w-6 h-6 mb-2" />
                <span className="font-medium">Card</span>
              </button>
            </div>
          </div>

          <div className={`rounded-lg p-4 ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`${dark ? 'text-gray-300' : 'text-gray-600'}`}>Items</span>
              <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{items.length}</span>
            </div>
            <div className={`flex items-center justify-between text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              <span>Total</span>
              <span className="text-[#FF9D6F]">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className={`border-t p-4 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Complete Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
