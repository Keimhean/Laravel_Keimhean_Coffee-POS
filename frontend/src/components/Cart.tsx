import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';

export function Cart() {
  const { dark } = useTheme();
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        <ShoppingCart className="w-16 h-16 mb-4" />
        <p className="text-lg">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className={`rounded-lg p-3 shadow-sm border ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className="flex items-start gap-3 mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9D6F] to-[#FF7B47] rounded-lg flex-shrink-0 overflow-hidden">
                {item.product.image ? (
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>{item.product.name}</h3>
                    <div className={`text-xs mt-1 space-y-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.size && <div>Size: {item.size}</div>}
                      {item.temperature && <div>Temp: {item.temperature}</div>}
                      {item.toppings.length > 0 && (
                        <div>Add-ons: {item.toppings.map((t) => t.name).join(', ')}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className={`p-1 rounded transition-colors text-red-500 ${dark ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className={`w-7 h-7 rounded border transition-colors flex items-center justify-center ${dark ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className={`w-8 text-center font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className={`w-7 h-7 rounded border transition-colors flex items-center justify-center ${dark ? 'border-gray-600 hover:bg-gray-700 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="font-bold text-[#FF9D6F]">${item.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t p-4 ${dark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className={`flex items-center justify-between text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
          <span>Total</span>
          <span className="text-2xl text-[#FF9D6F]">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
