import React from 'react';

const bannerBg = 'images/header.webp';

export default function Hero({ whatsappNumber }) {
  const waNumber = whatsappNumber ? whatsappNumber.replace(/[^\d]/g, '') : '';
  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${bannerBg})` }} aria-hidden="true" />
      <div className="hero-inner">
        <div className="hero-text">
          <span className="hero-eyebrow">Distribuidora oficial · Paraíso Resorts y Espumas Zebra Paraíso</span>
          <h1>El descanso que tu cuerpo merece</h1>
          <p>
            Distribuidores oficiales de colchones de resortes y espumas de alta
            densidad, con la calidad que respalda a dos de las marcas más confiables
            del mercado. Compra en línea y recibe tu pedido en casa.
          </p>
          <div className="hero-actions">
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
      </div>
    </section>
  );
}
