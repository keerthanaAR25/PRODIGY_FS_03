import React, { createContext, useContext, useReducer, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i._id === action.payload._id);
      if (exists) {
        return { ...state, items: state.items.map(i => i._id === action.payload._id ? { ...i, qty: Math.min(i.qty + 1, action.payload.stock) } : i) };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case 'REMOVE_ITEM': return { ...state, items: state.items.filter(i => i._id !== action.payload) };
    case 'UPDATE_QTY': return { ...state, items: state.items.map(i => i._id === action.payload.id ? { ...i, qty: action.payload.qty } : i) };
    case 'CLEAR_CART': return { ...state, items: [] };
    default: return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(localStorage.getItem('cart') || '[]')
  });

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(state.items)); }, [state.items]);

  const addToCart = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast.success(`${product.name} added to cart! 🛒`);
  };

  const removeFromCart = (id) => { dispatch({ type: 'REMOVE_ITEM', payload: id }); toast.success('Item removed'); };
  const updateQty = (id, qty) => { if (qty < 1) return; dispatch({ type: 'UPDATE_QTY', payload: { id, qty } }); };
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemsPrice = state.items.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 49;
  const taxPrice = Math.round(itemsPrice * 0.1);
  const totalPrice = itemsPrice + shippingPrice + taxPrice;
  const totalItems = state.items.reduce((a, i) => a + i.qty, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addToCart, removeFromCart, updateQty, clearCart, itemsPrice, shippingPrice, taxPrice, totalPrice, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);