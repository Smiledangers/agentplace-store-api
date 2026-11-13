# API Contract

This guide describes the existing implementation in src/server.js. It does not extend the API or replace openapi.json.

## Inventory lookup

**GET /api/products/{productId}/inventory**

The productId path parameter must be an uppercase P followed by three digits, excluding P000. The supported format is P001–P999; only P001–P010 exist in the synthetic fixtures.

A 200 response has a top-level data object containing:

- id: product ID.
- name: the original fixture product name.
- stock: non-negative integer.
- available: Boolean derived from whether stock is greater than zero.

P004 exists and has stock 0 and available false. A well-formed but absent ID such as P999 produces 404; it must not be interpreted as zero stock.

## Order-status lookup

**GET /api/orders/{orderId}/status**

The orderId path parameter must be an uppercase O followed by three digits, excluding O000. The supported format is O001–O999; only O001–O010 exist in the fixtures.

A 200 response has a top-level data object containing id, status, and updatedAt. Status values in the fixtures are pending, paid, processing, shipped, delivered, cancelled, and refunded. The updatedAt value is an ISO 8601 timestamp. O004 has status shipped.

## Authentication and request handling

Protected requests require an Authorization header whose value is Bearer followed by a space and the configured token. The expected token comes from STORE_API_KEY.

The implementation hashes the expected and supplied header values, then compares the fixed-length digests with timingSafeEqual. It does not implement user accounts, per-customer scopes, or order-ownership authorization.

GET /health and GET /openapi.json are public. Other requests authenticate before method, query, route, and ID validation. An unauthenticated write request therefore receives 401 before the method check.

Only GET is supported after authentication. Query parameters are rejected. Successful and failed JSON responses use Cache-Control: no-store.

## Error responses

An application error contains a top-level error object with code and message:

- 400 / INVALID_URL: the request URL cannot be parsed.
- 400 / INVALID_ID: the ID is missing or malformed on a recognized lookup route.
- 400 / INVALID_QUERY: query parameters were supplied.
- 401 / UNAUTHORIZED: the Bearer token is missing or incorrect; WWW-Authenticate is Bearer.
- 404 / NOT_FOUND: a well-formed ID has no matching fixture.
- 404 / ROUTE_NOT_FOUND: the requested route or action is not supported.
- 405 / METHOD_NOT_ALLOWED: an authenticated caller used another method; Allow is GET.

The HTTPS edge can reject malformed URLs before Node.js receives them. In the recorded Cloudflare run, the path containing %ZZ produced an edge-level HTTP 400 with an HTML body. That is distinct from the application's JSON error contract.

## Contract preservation

The English documentation does not change paths, methods, JSON field names, ID formats, token settings, response values, routing logic, or test assertions. Multilingual fixture names and original recordings are preserved.
