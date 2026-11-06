'use strict';

const mysql = require('mysql2/promise');

function connectionOptions() {
  const raw = process.env.DATABASE_URL;
  if (!raw) throw new Error('DATABASE_URL is required for Cinetix database access.');
  const url = new URL(raw);
  if (!['mysql:', 'mysql2:'].includes(url.protocol)) {
    throw new Error('DATABASE_URL must use the mysql:// scheme.');
  }
  const database = decodeURIComponent(url.pathname.replace(/^\//, ''));
  if (!url.hostname || !database) throw new Error('DATABASE_URL is missing its host or database name.');

  return {
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    timezone: 'Z',
    dateStrings: true,
    connectTimeout: 15000,
    enableKeepAlive: true,
    multipleStatements: false,
  };
}

function createPool() {
  const pool = mysql.createPool({
    ...connectionOptions(),
    waitForConnections: true,
    connectionLimit: 8,
    queueLimit: 0,
  });
  pool.on('connection', (connection) => {
    connection.query("SET SESSION time_zone = '+00:00'", (error) => {
      if (error) console.error('Cinetix database timezone initialization failed.');
    });
  });
  return pool;
}

module.exports = { connectionOptions, createPool };
