import React from 'react';
import { useCart } from '../context/CartContext';

const headerBg = 'images/header.webp';

export default function Header({ storeName, onOpenCart }) {
  const { count } = useCart();
  return (
    <header className="header">
      <div
        className="header-bg"
        style={{ backgroundImage: `url(${headerBg})` }}
        aria-hidden="true"
      />
      <div className="header-inner">
        <div className="brand">
          <img src="images/logo.jpeg" alt="Logo" className="brand-logo" />
          <div className="brand-text">
            <span className="brand-name">{storeName}</span>
            <span className="brand-sub">Colchones de resortes y espumas</span>
          </div>
        </div>
        <button className="cart-button" onClick={onOpenCart}>
          <span className="cart-icon">🛒</span> Carrito
          {count > 0 && <span className="cart-badge">{count}</span>}
        </button>
      </div>
    </header>
  );
}
