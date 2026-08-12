import React from 'react';
import { useCart } from '../context/CartContext';

export default function Header({ storeName, onOpenCart }) {
  const { count } = useCart();
  return (
    <header className="header">
      <div className="header-inner">
        <span className="logo">🛏️ {storeName}</span>
        <button className="cart-button" onClick={onOpenCart}>
          🛒 Carrito
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}
