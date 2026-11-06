'use strict';

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { createPool } = require('./db/connection');
const { createApiHandler } = require('./server/api');

const root = __dirname;
const pool = createPool();
const apiHandler = createApiHandler(pool);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
};
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data:; connect-src 'self'",
};

function sendText(response, status, text, contentType = 'text/plain; charset=utf-8') {
  response.writeHead(status, { 'Content-Type': contentType, 'Cache-Control': 'no-store', ...securityHeaders });
  response.end(text);
}

function serveStatic(request, response, pathname) {
  let relativePath;
  if (pathname === '/') relativePath = 'index.html';
  else if (pathname === '/manus-routes.json') relativePath = path.join('public', 'manus-routes.json');
  else if (pathname.startsWith('/src/')) relativePath = pathname.slice(1);
  else if (pathname.startsWith('/public/')) relativePath = pathname.slice(1);
  else return sendText(response, 404, 'Not found');

  const filePath = path.resolve(root, relativePath);
  const relative = path.relative(root, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) return sendText(response, 403, 'Forbidden');
  fs.stat(filePath, (error, stat) => {
    if (error || !stat.isFile()) return sendText(response, 404, 'Not found');
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': stat.size,
      'Cache-Control': 'no-store',
      ...securityHeaders,
    });
    if (request.method === 'HEAD') response.end();
    else fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  let url;
  try { url = new URL(request.url, 'http://cinetix.internal'); }
  catch { return sendText(response, 400, 'Bad request'); }

  if (url.pathname === '/_app/health' && ['GET','HEAD'].includes(request.method)) {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', ...securityHeaders });
    return response.end(request.method === 'HEAD' ? undefined : 'ok');
  }
  if (url.pathname.startsWith('/api/')) {
    if (!['GET','HEAD','POST','PUT','PATCH','DELETE'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD, POST, PUT, PATCH, DELETE');
      return sendText(response, 405, 'Method not allowed');
    }
    return apiHandler(request, response, url);
  }
  if (!['GET','HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return sendText(response, 405, 'Method not allowed');
  }

  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { return sendText(response, 400, 'Bad request'); }
  return serveStatic(request, response, pathname);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => console.log(`Cinetix server listening on 0.0.0.0:${port}`));

async function shutdown(signal) {
  console.log(`Cinetix shutting down (${signal}).`);
  server.close(async () => {
    await pool.end().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
