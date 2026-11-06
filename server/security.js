'use strict';

const crypto = require('node:crypto');
const { promisify } = require('node:util');

const SESSION_COOKIE = 'cinetix_session';
const CSRF_COOKIE = 'cinetix_csrf';
const SESSION_SECONDS = 7 * 24 * 60 * 60;
const scryptAsync = promisify(crypto.scrypt);

function cookieAttributes(maxAge, httpOnly) {
  const localHttp = process.env.CINETIX_COOKIE_MODE === 'local-http';
  const parts = [`Path=/`, `Max-Age=${maxAge}`, 'SameSite=None'];
  if (httpOnly) parts.push('HttpOnly');
  if (!localHttp) parts.push('Secure');
  else parts[parts.length - 1] = 'SameSite=Lax';
  return parts.join('; ');
}

function appendCookie(response, cookie) {
  const existing = response.getHeader('Set-Cookie');
  const list = existing ? (Array.isArray(existing) ? existing : [existing]) : [];
  response.setHeader('Set-Cookie', [...list, cookie]);
}

function readCookies(request) {
  const result = {};
  for (const part of String(request.headers.cookie || '').split(';')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    try { result[key] = decodeURIComponent(part.slice(index + 1).trim()); } catch { /* Ignore malformed cookie. */ }
  }
  return result;
}

function safeEqualText(left, right) {
  const a = Buffer.from(String(left || ''));
  const b = Buffer.from(String(right || ''));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function ensureCsrfCookie(request, response) {
  if (readCookies(request)[CSRF_COOKIE]) return;
  const token = crypto.randomBytes(32).toString('base64url');
  appendCookie(response, `${CSRF_COOKIE}=${encodeURIComponent(token)}; ${cookieAttributes(SESSION_SECONDS, false)}`);
}

function verifyCsrf(request) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) return true;
  if (request.headers['sec-fetch-site'] === 'cross-site') return false;
  const cookies = readCookies(request);
  const cookieToken = cookies[CSRF_COOKIE];
  const headerToken = request.headers['x-cinetix-csrf'];
  if (!cookieToken || !headerToken || !safeEqualText(cookieToken, headerToken)) return false;
  const origin = request.headers.origin;
  const referer = request.headers.referer;
  if (origin && referer) {
    try { if (new URL(referer).origin !== origin) return false; } catch { return false; }
  }
  return true;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const digest = await scryptAsync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${salt.toString('hex')}$${digest.toString('hex')}`;
}

async function verifyPassword(password, record) {
  if (typeof record !== 'string') return false;
  const [algorithm, saltHex, digestHex] = record.split('$');
  if (algorithm !== 'scrypt' || !/^[a-f0-9]{32}$/i.test(saltHex || '') || !/^[a-f0-9]{128}$/i.test(digestHex || '')) return false;
  const expected = Buffer.from(digestHex, 'hex');
  const actual = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return crypto.timingSafeEqual(actual, expected);
}

function userView(row) {
  if (!row) return null;
  return {
    id: String(row.public_id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    dob: row.dob || '',
    role: row.role,
    status: row.status,
  };
}

function tokenHash(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function createSession(pool, response, userId) {
  const rawToken = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000).toISOString().slice(0, 19).replace('T', ' ');
  await pool.execute('INSERT INTO sessions (user_id,token_hash,expires_at) VALUES (?,?,?)', [userId, tokenHash(rawToken), expiresAt]);
  appendCookie(response, `${SESSION_COOKIE}=${encodeURIComponent(rawToken)}; ${cookieAttributes(SESSION_SECONDS, true)}`);
}

async function getCurrentUser(pool, request) {
  const token = readCookies(request)[SESSION_COOKIE];
  if (!token || token.length > 256) return null;
  const [rows] = await pool.execute(
    `SELECT u.id,u.public_id,u.name,u.email,u.phone,DATE_FORMAT(u.dob,'%Y-%m-%d') AS dob,u.role,u.status
       FROM sessions s JOIN users u ON u.id=s.user_id
      WHERE s.token_hash=? AND s.expires_at>UTC_TIMESTAMP() AND u.status='active' LIMIT 1`,
    [tokenHash(token)]);
  return rows[0] || null;
}

async function destroySession(pool, request, response) {
  const token = readCookies(request)[SESSION_COOKIE];
  if (token && token.length <= 256) await pool.execute('DELETE FROM sessions WHERE token_hash=?', [tokenHash(token)]);
  appendCookie(response, `${SESSION_COOKIE}=; ${cookieAttributes(0, true)}`);
}

module.exports = {
  SESSION_COOKIE,
  CSRF_COOKIE,
  appendCookie,
  ensureCsrfCookie,
  verifyCsrf,
  hashPassword,
  verifyPassword,
  userView,
  createSession,
  getCurrentUser,
  destroySession,
};
