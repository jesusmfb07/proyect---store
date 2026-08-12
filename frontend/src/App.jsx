import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { apiFetch } from './config';
import Header from './components/Header';
import Hero from './components/Hero';
import Catalog from './components/Catalog';
import Benefits from './components/Benefits';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminPage from './pages/AdminPage';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [storeName, setStoreName] = useState('Colchonería Paraíso');
  const [storeAddress, setStoreAddress] = useState('');
  const [currency, setCurrency] = useState('S/');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [category, setCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiFetch('/api/products').then((r) => r.json()),
      apiFetch('/api/config').then((r) => r.json()),
    ])
      .then(([prod, conf]) => {
        setProducts(prod);
        setStoreName(conf.storeName);
        setStoreAddress(conf.storeAddress);
        setCurrency(conf.currency);
        setWhatsappNumber(conf.whatsappNumber);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudo conectar con el servidor. Revisa que el backend esté corriendo.');
        setLoading(false);
      });
  }, []);

  return (
    <HashRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Header storeName={storeName} onOpenCart={() => setCartOpen(true)} />
                  <Hero whatsappNumber={whatsappNumber} />
                  <Benefits />
                  {loading ? (
                    <p className="loading">Cargando productos…</p>
                  ) : error ? (
                    <p className="loading error">{error}</p>
                  ) : (
                    <Catalog
                      products={products}
                      currency={currency}
                      category={category}
                      setCategory={setCategory}
                    />
                  )}
                  <Footer storeName={storeName} storeAddress={storeAddress} />
                  <CartDrawer
                    open={cartOpen}
                    currency={currency}
                    onClose={() => setCartOpen(false)}
                    onCheckout={() => {
                      setCartOpen(false);
                      setCheckoutOpen(true);
                    }}
                  />
                  <CheckoutModal
                    open={checkoutOpen}
                    currency={currency}
                    onClose={() => setCheckoutOpen(false)}
                  />
                </div>
              }
            />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </HashRouter>
  );
}
