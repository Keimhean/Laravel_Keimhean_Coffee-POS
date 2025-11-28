import { X, Calendar, User, CreditCard } from 'lucide-react';

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Order #{order.id}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Customer</div>
                <div className="font-medium">{order.customer_name}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="font-medium">
                  {new Date(order.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-xs text-gray-500">Payment</div>
                <div className="font-medium capitalize">{order.payment_method}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                order.status === 'completed' ? 'bg-green-500' :
                order.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-medium capitalize">{order.status}</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        {item.size && <div>Size: {item.size}</div>}
                        {item.temperature && <div>Temperature: {item.temperature}</div>}
                        {item.toppings && item.toppings.length > 0 && (
                          <div>Add-ons: {item.toppings.map((t: any) => t.name).join(', ')}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${parseFloat(item.subtotal).toFixed(2)}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-[#FF9D6F]">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
