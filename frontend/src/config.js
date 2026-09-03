import { STORE_CONFIG } from './data/products';

export const WHATSAPP_NUMBER = STORE_CONFIG.whatsappNumber;
export const SITE_NAME = STORE_CONFIG.storeName;
export const SITE_ADDRESS = STORE_CONFIG.storeAddress;
export const CURRENCY = STORE_CONFIG.currency;

export function waNumberOnly() {
  return WHATSAPP_NUMBER.replace(/[^\d]/g, '');
}

export function money(n) {
  return `${CURRENCY} ${Number(n).toFixed(2)}`;
}

export function oldPrice(price) {
  const p = Number(price);
  if (p >= 400) return p + 70;
  if (p >= 200) return p + 60;
  return p + 50;
}

