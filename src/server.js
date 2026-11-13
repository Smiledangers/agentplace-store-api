import http from 'node:http';
import { readFileSync } from 'node:fs';
import { timingSafeEqual, createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const products = JSON.parse(readFileSync(new URL('../data/products.json', import.meta.url)));
const orders = JSON.parse(readFileSync(new URL('../data/orders.json', import.meta.url)));
const schema = JSON.parse(readFileSync(new URL('../openapi.json', import.meta.url)));
const digest = value => createHash('sha256').update(value).digest();

export function createServer({ apiKey, audit = () => {} } = {}) {
  if (typeof apiKey !== 'string' || apiKey.length < 32 || apiKey.trim() !== apiKey || /\s/.test(apiKey)) {
    throw new Error('STORE_API_KEY must contain at least 32 non-whitespace characters.');
  }
  const expected = digest(`Bearer ${apiKey}`);
  return http.createServer((req, res) => {
    let url;
    res.on('finish', () => audit({ recordedAt: new Date().toISOString(), method: req.method, path: url?.pathname ?? '(invalid)', httpStatus: res.statusCode }));
    const send = (status, body, headers = {}) => {
      res.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        ...headers,
      });
      res.end(JSON.stringify(body));
    };
    const error = (status, code, message, headers) => send(status, { error: { code, message } }, headers);
    try { url = new URL(req.url, 'http://localhost'); }
    catch { return error(400, 'INVALID_URL', 'Invalid request URL.'); }

    if (url.pathname === '/health' && req.method === 'GET') return send(200, { status: 'ok' });
    if (url.pathname === '/openapi.json' && req.method === 'GET') return send(200, schema);

    // Authenticate before routing/validation so rejected clients learn no record details.
    if (!timingSafeEqual(digest(req.headers.authorization ?? ''), expected)) {
      return error(401, 'UNAUTHORIZED', 'A valid Bearer token is required.', { 'WWW-Authenticate': 'Bearer' });
    }
    if (req.method !== 'GET') return error(405, 'METHOD_NOT_ALLOWED', 'Only GET is supported.', { Allow: 'GET' });
    if ([...url.searchParams].length) return error(400, 'INVALID_QUERY', 'Query parameters are not supported.');
    const match = /^\/api\/(products|orders)(?:\/([^/]*))?(?:\/(inventory|status))?$/.exec(url.pathname);
    if (!match) return error(404, 'ROUTE_NOT_FOUND', 'API route not found.');
    const [, kind, rawId, action] = match;
    const expectedAction = kind === 'products' ? 'inventory' : 'status';
    if (action && action !== expectedAction) return error(404, 'ROUTE_NOT_FOUND', 'API route not found.');
    let id;
    try { id = decodeURIComponent(rawId ?? ''); }
    catch { return error(400, 'INVALID_ID', 'ID must be P001–P999 or O001–O999, according to the resource.'); }
    const pattern = kind === 'products' ? /^P(?!000)\d{3}$/ : /^O(?!000)\d{3}$/;
    if (id.length !== 4 || !pattern.test(id)) return error(400, 'INVALID_ID', kind === 'products' ? 'Product ID must be P001–P999.' : 'Order ID must be O001–O999.');
    if (action !== expectedAction) return error(404, 'ROUTE_NOT_FOUND', 'API route not found.');
    const record = (kind === 'products' ? products : orders).find(item => item.id === id);
    if (!record) return error(404, 'NOT_FOUND', `${kind === 'products' ? 'Product' : 'Order'} not found.`);
    return send(200, { data: kind === 'products' ? { ...record, available: record.stock > 0 } : record });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const port = Number(process.env.PORT ?? 43187);
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1–65535.');
    const server = createServer({ apiKey: process.env.STORE_API_KEY, audit: entry => console.log(JSON.stringify(entry)) });
    server.on('error', error => { console.error(error.message); process.exitCode = 1; });
    server.listen(port, process.env.HOST ?? '127.0.0.1', () => console.log(`Store API listening on port ${port}`));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
