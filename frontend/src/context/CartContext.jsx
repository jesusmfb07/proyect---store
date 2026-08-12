import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = `${action.item.productId}::${action.item.size}`;
      const existing = state.find((i) => i.key === key);
      if (existing) {
        return state.map((i) =>
          i.key === key ? { ...i, qty: i.qty + action.item.qty } : i
        );
      }
      return [...state, { ...action.item, key }];
    }
    case 'REMOVE':
      return state.filter((i) => i.key !== action.key);
    case 'SET_QTY':
      return state.map((i) =>
        i.key === action.key ? { ...i, qty: Math.max(1, action.qty) } : i
      );
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, []);

  const total = Number(
    items.reduce((acc, i) => acc + i.unitPrice * i.qty, 0).toFixed(2)
  );
  const count = items.reduce((acc, i) => acc + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, total, count, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
