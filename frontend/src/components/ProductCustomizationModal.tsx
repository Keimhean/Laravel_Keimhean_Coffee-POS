import { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProductCustomizationModalProps {
  product: any;
  onClose: () => void;
  onAdd: (customization: any) => void;
}

export function ProductCustomizationModal({
  product,
  onClose,
  onAdd,
}: ProductCustomizationModalProps) {
  const { dark } = useTheme();
  const [size, setSize] = useState<'Small' | 'Large'>('Small');
  const [temperature, setTemperature] = useState<'Hot' | 'Cold' | null>(
    product.has_temperature ? 'Hot' : null
  );
  const [selectedToppings, setSelectedToppings] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);

  const toggleTopping = (topping: any) => {
    if (selectedToppings.find((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateTotal = () => {
    let total = parseFloat(product.price);
    
    if (size === 'Large') {
      total *= 1.3;
    }
    
    selectedToppings.forEach((topping) => {
      total += parseFloat(topping.price);
    });
    
    return total * quantity;
  };

  const handleAdd = () => {
    onAdd({
      product,
      size,
      temperature,
      toppings: selectedToppings,
      quantity,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${dark ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto`}>
        <div className={`sticky top-0 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4 flex items-center justify-between`}>
          <h2 className={`text-xl ${dark ? 'text-white' : 'text-gray-900'}`}>Customize {product.name}</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${dark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X className={`w-5 h-5 ${dark ? 'text-gray-300' : 'text-gray-700'}`} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Size Selection */}
          {product.has_size && (
            <div>
              <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Size</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSize('Small')}
                  className={`py-3 rounded-lg border-2 transition-colors ${
                    size === 'Small'
                      ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                      : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Small
                </button>
                <button
                  onClick={() => setSize('Large')}
                  className={`py-3 rounded-lg border-2 transition-colors ${
                    size === 'Large'
                      ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                      : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Large (+30%)
                </button>
              </div>
            </div>
          )}

          {/* Temperature Selection */}
          {product.has_temperature && (
            <div>
              <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Temperature</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTemperature('Hot')}
                  className={`py-3 rounded-lg border-2 transition-colors ${
                    temperature === 'Hot'
                      ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                      : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Hot
                </button>
                <button
                  onClick={() => setTemperature('Cold')}
                  className={`py-3 rounded-lg border-2 transition-colors ${
                    temperature === 'Cold'
                      ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10 text-[#FF9D6F]'
                      : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Cold
                </button>
              </div>
            </div>
          )}

          {/* Toppings Selection */}
          {product.toppings && product.toppings.length > 0 && (
            <div>
              <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Add-ons (Optional)</label>
              <div className="space-y-2">
                {product.toppings.map((topping: any) => (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping)}
                    className={`w-full p-3 rounded-lg border-2 transition-colors text-left flex items-center justify-between ${
                      selectedToppings.find((t) => t.id === topping.id)
                        ? 'border-[#FF9D6F] bg-[#FF9D6F] bg-opacity-10'
                        : dark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className={selectedToppings.find((t) => t.id === topping.id) ? 'text-[#FF9D6F]' : ''}>{topping.name}</span>
                    <span className={`text-sm ${selectedToppings.find((t) => t.id === topping.id) ? 'text-[#FF9D6F]' : dark ? 'text-gray-400' : 'text-gray-600'}`}>+${parseFloat(topping.price).toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className={`w-10 h-10 rounded-lg border transition-colors text-lg font-semibold ${dark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                -
              </button>
              <span className={`text-xl font-semibold w-12 text-center ${dark ? 'text-white' : 'text-gray-900'}`}>{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className={`w-10 h-10 rounded-lg border transition-colors text-lg font-semibold ${dark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'}`}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className={`sticky bottom-0 ${dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-4`}>
          <div className="flex items-center justify-between mb-4">
            <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>Total</span>
            <span className="text-2xl font-bold text-[#FF9D6F]">${calculateTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleAdd}
            className="w-full py-3 bg-gradient-to-r from-[#FF9D6F] to-[#FF7B47] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
