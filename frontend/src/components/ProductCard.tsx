import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Coffee } from 'lucide-react';
import { ProductCustomizationModal } from './ProductCustomizationModal.tsx';

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { addItem } = useCart();

  const handleClick = () => {
    if (product.has_temperature || product.has_size || product.toppings?.length > 0) {
      setShowModal(true);
    } else {
      addItem({
        product,
        size: 'Small',
        temperature: null,
        toppings: [],
        quantity: 1,
      });
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-4 text-left w-full ring-1 ring-transparent dark:ring-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9D6F]"
      >
        <div className="w-full h-32 bg-gradient-to-br from-[#FF9D6F] to-[#FF7B47] dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Coffee className="w-12 h-12 text-white" />
          )}
        </div>
        <h3 className="font-semibold mb-1 line-clamp-1 text-gray-900 dark:text-gray-100">{product.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold text-[#FF9D6F]">${parseFloat(product.price).toFixed(2)}</p>
      </button>

      {showModal && (
        <ProductCustomizationModal
          product={product}
          onClose={() => setShowModal(false)}
          onAdd={(customization: any) => {
            addItem(customization);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
