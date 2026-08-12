const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const config = require('./config.json');

const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

let mode = 'json';
let pool = null;

async function initStore() {
  const url = process.env.DATABASE_URL || config.databaseUrl || null;
  if (url) {
    const ssl = /sslmode=require|neon\.tech/.test(url)
      ? { rejectUnauthorized: false }
      : undefined;
    pool = new Pool({ connectionString: url, ssl, connectionTimeoutMillis: 10000 });
    try {
      await pool.query(
        `CREATE TABLE IF NOT EXISTS orders (
          id TEXT PRIMARY KEY,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT now()
        )`
      );
      mode = 'postgres';
      console.log('Almacén de pedidos: PostgreSQL conectado.');
      return;
    } catch (err) {
      console.error('No se pudo conectar a PostgreSQL, se usará JSON: ' + err.message);
      pool = null;
    }
  }
  mode = 'json';
  console.log('Almacén de pedidos: archivo JSON (modo local).');
}

async function saveOrder(order) {
  if (mode === 'postgres') {
    await pool.query('INSERT INTO orders (id, data) VALUES ($1, $2)', [
      order.id,
      JSON.stringify(order),
    ]);
  } else {
    const orders = readOrdersFile();
    orders.push(order);
    writeOrdersFile(orders);
  }
}

async function getOrders() {
  if (mode === 'postgres') {
    const res = await pool.query('SELECT data FROM orders ORDER BY created_at DESC');
    return res.rows.map((r) => r.data);
  }
  return readOrdersFile().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function readOrdersFile() {
  try {
    return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeOrdersFile(orders) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

module.exports = { initStore, saveOrder, getOrders };
