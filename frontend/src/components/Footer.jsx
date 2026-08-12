import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer({ storeName, storeAddress }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>{storeName}</strong>
          <p>Distribuidor oficial de colchones de resortes y espumas de alta calidad.</p>
          {storeAddress && <p className="footer-address">📍 {storeAddress}, Perú</p>}
        </div>
        <div className="footer-links">
          <span>Venta y asesoría por WhatsApp</span>
          <Link to="/admin">Acceso vendedores</Link>
        </div>
      </div>
    </footer>
  );
}
