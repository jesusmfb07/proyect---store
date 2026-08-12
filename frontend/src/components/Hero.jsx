import React from 'react';

export default function Hero({ whatsappNumber }) {
  const waNumber = whatsappNumber ? whatsappNumber.replace(/[^\d]/g, '') : '51999999999';
  return (
    <section className="hero">
      <div className="hero-inner">
        <span className="hero-eyebrow">Colchones Paraíso Resorts · Espumas Zebra</span>
        <h1>El descanso que tu cuerpo merece</h1>
        <p>
          Colchones de resortes y espumas de alta densidad, con la calidad que
          respalda a dos de las marcas más confiables del mercado. Compra en línea
          y recibe tu pedido en casa.
        </p>
        <div className="hero-actions">
          <a href="#catalogo" className="btn btn-primary">
            Ver catálogo
          </a>
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
              'Hola, quisiera asesoría para comprar un colchón.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp"
          >
            💬 Asesoría por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
