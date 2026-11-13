import assert from 'node:assert/strict';

export const cases = [
  ...Array.from({ length: 10 }, (_, i) => ({ name: `product P${String(i + 1).padStart(3, '0')}`, path: `/api/products/P${String(i + 1).padStart(3, '0')}/inventory`, status: 200, id: `P${String(i + 1).padStart(3, '0')}` })),
  ...Array.from({ length: 10 }, (_, i) => ({ name: `order O${String(i + 1).padStart(3, '0')}`, path: `/api/orders/O${String(i + 1).padStart(3, '0')}/status`, status: 200, id: `O${String(i + 1).padStart(3, '0')}` })),
  { name: 'unknown product', path: '/api/products/P999/inventory', status: 404, code: 'NOT_FOUND' },
  { name: 'unknown order', path: '/api/orders/O999/status', status: 404, code: 'NOT_FOUND' },
  ...['abc', 'P000', 'P01', 'p001', 'O001', '%20P001', '%ZZ', 'P001%2Finventory', 'P001%0A'].map(id => ({ name: `invalid product ${id}`, path: `/api/products/${id}/inventory`, status: 400, code: 'INVALID_ID' })),
  ...['abc', 'O000', 'O01', 'o001', 'P001', 'O001%0A'].map(id => ({ name: `invalid order ${id}`, path: `/api/orders/${id}/status`, status: 400, code: 'INVALID_ID' })),
  { name: 'missing product ID', path: '/api/products//inventory', status: 400, code: 'INVALID_ID' },
  { name: 'missing order ID', path: '/api/orders//status', status: 400, code: 'INVALID_ID' },
  { name: 'unexpected query', path: '/api/products/P001/inventory?stock=500', status: 400, code: 'INVALID_QUERY' },
  { name: 'missing token', path: '/api/products/P001/inventory', auth: 'none', status: 401, code: 'UNAUTHORIZED' },
  { name: 'wrong token', path: '/api/orders/O001/status', auth: 'wrong', status: 401, code: 'UNAUTHORIZED' },
  { name: 'unauthorized invalid ID', path: '/api/orders/bad/status', auth: 'none', status: 401, code: 'UNAUTHORIZED' },
  ...['POST', 'PUT', 'PATCH', 'DELETE'].map(method => ({ name: `reject ${method}`, path: '/api/products/P001/inventory', method, status: 405, code: 'METHOD_NOT_ALLOWED' })),
  { name: 'unknown route', path: '/api/admin', status: 404, code: 'ROUTE_NOT_FOUND' },
  { name: 'health', path: '/health', auth: 'none', status: 200 },
  { name: 'OpenAPI', path: '/openapi.json', auth: 'none', status: 200 },
];

export async function runCase(base, key, scenario) {
  const response = await fetch(`${base}${scenario.path}`, {
    method: scenario.method ?? 'GET',
    headers: scenario.auth === 'none' ? {} : { Authorization: `Bearer ${scenario.auth === 'wrong' ? 'invalid' : key}` },
  });
  const body = await response.json();
  assert.equal(response.status, scenario.status);
  if (scenario.code) assert.equal(body.error.code, scenario.code);
  if (scenario.id) assert.equal(body.data.id, scenario.id);
  if (scenario.id?.startsWith('P')) {
    assert.equal(body.data.available, body.data.stock > 0);
    assert.ok(Number.isInteger(body.data.stock) && body.data.stock >= 0);
  }
  if (scenario.id === 'P001') assert.equal(body.data.stock, 25);
  if (scenario.id === 'P004') assert.equal(body.data.stock, 0);
  if (scenario.id === 'O004') assert.equal(body.data.status, 'shipped');
  if (scenario.status === 401) assert.equal(response.headers.get('www-authenticate'), 'Bearer');
  if (scenario.status === 405) assert.equal(response.headers.get('allow'), 'GET');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.ok(!JSON.stringify(body).includes(key));
  return { name: scenario.name, method: scenario.method ?? 'GET', path: scenario.path, httpStatus: response.status, response: body, result: 'PASS' };
}
