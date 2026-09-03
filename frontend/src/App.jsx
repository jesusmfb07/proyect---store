import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Benefits from './components/Benefits';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ProductModal from './components/ProductModal';
import { PRODUCTS, STORE_CONFIG } from './data/products';
import './styles.css';

export default function App() {
  const [category, setCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <CartProvider>
      <Header storeName={STORE_CONFIG.storeName} onOpenCart={() => setCartOpen(true)} />
      <Hero whatsappNumber={STORE_CONFIG.whatsappNumber} />
      <Benefits />
      <Catalog
        products={PRODUCTS}
        category={category}
        setCategory={setCategory}
        onSelect={setSelected}
      />
      <Footer storeName={STORE_CONFIG.storeName} storeAddress={STORE_CONFIG.storeAddress} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </CartProvider>
  );
}
