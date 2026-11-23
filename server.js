/**
 * FLA Property Maintenance LLC — Production Node.js Backend Server (server.js)
 * Pure Node.js Standard Library (zero npm install required)
 * 
 * Features:
 *  - Static file server with caching & mime handling
 *  - Full REST API under /api/* (Quotes, Reviews, Portfolio, Settings, Theme)
 *  - Persistent JSON disk storage in ./data/
 *  - Real-time Server-Sent Events (SSE) on /api/events for multi-client synchronization
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css':  'text/css; charset=UTF-8',
  '.js':   'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webp': 'image/webp',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.mp4':  'video/mp4',
  '.webm': 'video/webm',
  '.csv':  'text/csv; charset=UTF-8',
  '.txt':  'text/plain; charset=UTF-8'
};

// Data Helpers
function readJson(file, defaultVal = []) {
  const p = path.join(DATA_DIR, file);
  try {
    if (!fs.existsSync(p)) {
      writeJson(file, defaultVal);
      return defaultVal;
    }
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error('Error reading ' + file + ':', err);
    return defaultVal;
  }
}

function writeJson(file, data) {
  const p = path.join(DATA_DIR, file);
  try {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing ' + file + ':', err);
    return false;
  }
}

// Server-Sent Events (SSE) Clients for Realtime Updates
const sseClients = new Set();

function broadcastEvent(eventType, payload) {
  const msg = `event: ${eventType}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(msg);
    } catch (e) {
      sseClients.delete(client);
    }
  }
}

// Request Body Parser Helper
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 25 * 1024 * 1024) { // 25 MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// HTTP Server
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsed.pathname);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // ══════════════════════════════════════════════════════════
  // REAL-TIME SERVER-SENT EVENTS STREAM (/api/events)
  // ══════════════════════════════════════════════════════════
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('data: {"type":"connected"}\n\n');
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  // ══════════════════════════════════════════════════════════
  // REST API ROUTES (/api/*)
  // ══════════════════════════════════════════════════════════

  // 1. Auth Login
  if (pathname === '/api/login' && req.method === 'POST') {
    try {
      const { username, password } = await parseJsonBody(req);
      const settings = readJson('settings.json', {});
      const validUser = settings.adminUser || 'admin';
      const validPass = settings.adminPassword || 'FLA@admin2024';

      if (username === validUser && password === validPass) {
        const token = 'fla_tok_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
        return sendJson(res, 200, { success: true, token, user: username });
      }
      return sendJson(res, 401, { success: false, message: 'Invalid username or password' });
    } catch (e) {
      return sendJson(res, 400, { success: false, message: e.message });
    }
  }

  // 2. Quotes API
  if (pathname === '/api/quotes') {
    if (req.method === 'GET') {
      const quotes = readJson('quotes.json', []);
      return sendJson(res, 200, quotes);
    }
    if (req.method === 'POST') {
      try {
        const quote = await parseJsonBody(req);
        const quotes = readJson('quotes.json', []);
        quote.id = quote.id || 'quote_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        quote.status = quote.status || 'new';
        quote.createdAt = quote.createdAt || new Date().toISOString();
        quotes.unshift(quote);
        writeJson('quotes.json', quotes);
        broadcastEvent('quote_created', quote);
        return sendJson(res, 201, quote);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }
  }

  if (pathname.startsWith('/api/quotes/')) {
    const id = pathname.replace('/api/quotes/', '');
    const quotes = readJson('quotes.json', []);
    const idx = quotes.findIndex(q => String(q.id) === id);

    if (req.method === 'PATCH') {
      try {
        const updates = await parseJsonBody(req);
        if (idx === -1) return sendJson(res, 404, { error: 'Quote not found' });
        quotes[idx] = { ...quotes[idx], ...updates, updatedAt: new Date().toISOString() };
        writeJson('quotes.json', quotes);
        broadcastEvent('quote_updated', quotes[idx]);
        return sendJson(res, 200, quotes[idx]);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    if (req.method === 'DELETE') {
      if (idx === -1) return sendJson(res, 404, { error: 'Quote not found' });
      const removed = quotes.splice(idx, 1)[0];
      writeJson('quotes.json', quotes);
      broadcastEvent('quote_deleted', { id });
      return sendJson(res, 200, { success: true, removed });
    }
  }

  // 3. Reviews API
  if (pathname === '/api/reviews') {
    if (req.method === 'GET') {
      const reviews = readJson('reviews.json', []);
      // If public query ?approved=true requested
      if (parsed.query && parsed.query.approved === 'true') {
        return sendJson(res, 200, reviews.filter(r => r.approved));
      }
      return sendJson(res, 200, reviews);
    }
    if (req.method === 'POST') {
      try {
        const rev = await parseJsonBody(req);
        const reviews = readJson('reviews.json', []);
        rev.id = rev.id || 'rev_' + Date.now();
        rev.createdAt = rev.createdAt || new Date().toISOString();
        // If not explicitly set by admin, default to pending (approved: false)
        if (typeof rev.approved === 'undefined') {
          rev.approved = false;
        }
        reviews.unshift(rev);
        writeJson('reviews.json', reviews);
        broadcastEvent('review_created', rev);
        return sendJson(res, 201, rev);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }
  }

  if (pathname.startsWith('/api/reviews/')) {
    const parts = pathname.replace('/api/reviews/', '').split('/');
    const id = parts[0];
    const action = parts[1];
    const reviews = readJson('reviews.json', []);
    const idx = reviews.findIndex(r => String(r.id) === id);

    if (action === 'approve' && req.method === 'PATCH') {
      try {
        const { approved } = await parseJsonBody(req);
        if (idx === -1) return sendJson(res, 404, { error: 'Review not found' });
        reviews[idx].approved = typeof approved === 'boolean' ? approved : true;
        writeJson('reviews.json', reviews);
        broadcastEvent('review_updated', reviews[idx]);
        return sendJson(res, 200, reviews[idx]);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    if (req.method === 'PUT') {
      try {
        const body = await parseJsonBody(req);
        if (idx === -1) return sendJson(res, 404, { error: 'Review not found' });
        reviews[idx] = { ...reviews[idx], ...body, id, updatedAt: new Date().toISOString() };
        writeJson('reviews.json', reviews);
        broadcastEvent('review_updated', reviews[idx]);
        return sendJson(res, 200, reviews[idx]);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    if (req.method === 'DELETE') {
      if (idx === -1) return sendJson(res, 404, { error: 'Review not found' });
      const removed = reviews.splice(idx, 1)[0];
      writeJson('reviews.json', reviews);
      broadcastEvent('review_deleted', { id });
      return sendJson(res, 200, { success: true, removed });
    }
  }

  // 4. Portfolio API
  if (pathname === '/api/portfolio') {
    if (req.method === 'GET') {
      return sendJson(res, 200, readJson('portfolio.json', []));
    }
    if (req.method === 'POST') {
      try {
        const item = await parseJsonBody(req);
        const portfolio = readJson('portfolio.json', []);
        item.id = item.id || 'port_' + Date.now();
        item.createdAt = item.createdAt || new Date().toISOString();
        portfolio.unshift(item);
        writeJson('portfolio.json', portfolio);
        broadcastEvent('portfolio_created', item);
        return sendJson(res, 201, item);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }
  }

  if (pathname.startsWith('/api/portfolio/')) {
    const id = pathname.replace('/api/portfolio/', '');
    const portfolio = readJson('portfolio.json', []);
    const idx = portfolio.findIndex(p => String(p.id) === id);

    if (req.method === 'PUT') {
      try {
        const item = await parseJsonBody(req);
        if (idx === -1) return sendJson(res, 404, { error: 'Item not found' });
        portfolio[idx] = { ...portfolio[idx], ...item, id, updatedAt: new Date().toISOString() };
        writeJson('portfolio.json', portfolio);
        broadcastEvent('portfolio_updated', portfolio[idx]);
        return sendJson(res, 200, portfolio[idx]);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }

    if (req.method === 'DELETE') {
      if (idx === -1) return sendJson(res, 404, { error: 'Item not found' });
      const removed = portfolio.splice(idx, 1)[0];
      writeJson('portfolio.json', portfolio);
      broadcastEvent('portfolio_deleted', { id });
      return sendJson(res, 200, { success: true, removed });
    }
  }

  // 5. Settings API
  if (pathname === '/api/settings') {
    if (req.method === 'GET') {
      return sendJson(res, 200, readJson('settings.json', {}));
    }
    if (req.method === 'POST') {
      try {
        const newSettings = await parseJsonBody(req);
        const current = readJson('settings.json', {});
        const merged = { ...current, ...newSettings };
        writeJson('settings.json', merged);
        broadcastEvent('settings_updated', merged);
        return sendJson(res, 200, merged);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }
  }

  // 6. Theme Colors API
  if (pathname === '/api/theme') {
    if (req.method === 'GET') {
      return sendJson(res, 200, readJson('theme.json', {}));
    }
    if (req.method === 'POST') {
      try {
        const newTheme = await parseJsonBody(req);
        writeJson('theme.json', newTheme);
        broadcastEvent('theme_updated', newTheme);
        return sendJson(res, 200, newTheme);
      } catch (e) {
        return sendJson(res, 400, { error: e.message });
      }
    }
  }

  // ══════════════════════════════════════════════════════════
  // STATIC FILE SERVING
  // ══════════════════════════════════════════════════════════
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (pathname === '/admin') {
    pathname = '/admin/index.html';
  } else if (pathname === '/admin/') {
    pathname = '/admin/index.html';
  } else if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  // If path is a directory, serve its index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end('404 Not Found: ' + pathname);
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` FLA Property Maintenance — Backend Server Active `);
  console.log(` Web Server:    http://localhost:${PORT}`);
  console.log(` Admin Portal:  http://localhost:${PORT}/admin`);
  console.log(` REST API:      http://localhost:${PORT}/api/quotes`);
  console.log(` Data Storage:  ${DATA_DIR}`);
  console.log(`=======================================================`);
});
