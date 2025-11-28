import { X, Calendar, User, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  const { dark } = useTheme();
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <div className={`sticky top-0 border-b p-4 flex items-center justify-between ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-xl font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Order #{order.id}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X className={`w-5 h-5 ${dark ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Customer</div>
                <div className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{order.customer_name}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Date</div>
                <div className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Payment</div>
                <div className={`font-medium capitalize ${dark ? 'text-white' : 'text-gray-900'}`}>{order.payment_method}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                order.status === 'completed' ? 'bg-green-500' :
                order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Status</div>
                <div className={`font-medium capitalize ${dark ? 'text-white' : 'text-gray-900'}`}>{order.status}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className={`font-semibold mb-3 ${dark ? 'text-white' : 'text-gray-900'}`}>Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className={`rounded-lg p-4 ${dark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</h4>
                      <div className={`text-xs mt-1 space-y-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.size && <div>Size: {item.size}</div>}
                        {item.temperature && <div>Temperature: {item.temperature}</div>}
                        {item.toppings && item.toppings.length > 0 && (
                          <div>Add-ons: {item.toppings.map((t: any) => t.name).join(', ')}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>${parseFloat(item.subtotal).toFixed(2)}</div>
                      <div className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className={`border-t pt-4 ${dark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className={`flex items-center justify-between text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              <span>Total Amount</span>
              <span className="text-[#FF9D6F]">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
