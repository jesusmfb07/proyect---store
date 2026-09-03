import React from 'react';
import { waNumberOnly } from '../config';

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
          <a
            href={`https://wa.me/${waNumberOnly()}`}
            target="_blank"
            rel="noreferrer"
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
