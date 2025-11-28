import { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  product: any;
  size: 'Small' | 'Large';
  temperature: 'Hot' | 'Cold' | null;
  toppings: any[];
  quantity: number;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'totalPrice'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const calculateItemPrice = (item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    let price = parseFloat(item.product.price);
    
    if (item.size === 'Large') {
      price *= 1.3;
    }
    
    item.toppings.forEach((topping) => {
      price += parseFloat(topping.price);
    });
    
    return price * item.quantity;
  };

  const addItem = (item: Omit<CartItem, 'id' | 'totalPrice'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const totalPrice = calculateItemPrice(item);
    
    setItems([...items, { ...item, id, totalPrice }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setItems(items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, quantity: newQuantity };
        return { ...updatedItem, totalPrice: calculateItemPrice(updatedItem) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const total = getSubtotal();

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getSubtotal, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
