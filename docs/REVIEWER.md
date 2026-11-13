# Reviewer quick start

This is a read-only store service for the Agentplace Backend Engineer exercise. All records are synthetic. It requires Node.js 22+ and has no third-party runtime dependencies.

1. Copy `.env.example` to `.env`, set a random `STORE_API_KEY` of at least 32 characters, and run `npm start`.
2. The local default port is **43187**. Port 3000 is deliberately avoided because an existing service uses it on the author's computer. A bind failure exits without affecting the other service.
3. Call `GET /api/products/P001/inventory` or `GET /api/orders/O004/status` with `Authorization: Bearer YOUR_TOKEN`.
4. Run `npm test` and `npm run evidence`. The evidence runner makes actual HTTP requests against an isolated ephemeral local server and shuts it down afterward.

The current HTTP evidence contains **50 passing scenarios**, including all 10 products and 10 orders, zero stock, unknown records, invalid identifiers, missing/incorrect credentials, and rejected write methods. The Node test report contains 52 passing tests including the parent test and fail-closed configuration test.

Success responses use `{ "data": ... }`. Failures use `{ "error": { "code": ..., "message": ... } }`. API routes authenticate before validation. A missing or invalid token returns 401; invalid identifiers return 400; well-formed but absent identifiers return 404. Only GET is supported. The public health/schema routes contain no credentials.

The shared token grants service-level read access to synthetic records. It is not customer-level authorization. A production store would need verified customer identity and order-ownership checks before serving real orders.

`openapi.json` contains the two tool operation contracts. Replace its local server URL with a real HTTPS deployment URL before integration. Agent credentials belong in the platform's server-side secret settings, never in frontend code or messages.

## Integration evidence and limits

The Agentplace source configuration selects `openai.gpt-6-luna` with low reasoning effort and no role-specific overrides. The Builder was also explicitly set to GPT-6 Luna. Provider routing is managed by the platform; the source setting does not establish the resolved provider model for every turn.

The backend is now connected through a temporary Cloudflare HTTPS tunnel. `public-api-results.json` records 49 successful API contract checks and one malformed URL rejected by the edge with HTTP 400 before reaching the application. Local Node tests cover that malformed URL's JSON response at the application layer.

Six core Agent cases have observed replies and matching API request traces: an existing product, zero stock, an existing order, an unknown product, an unknown order, and a real HTTP 401. After the 401 test, normal authorization was restored and the same product query succeeded again. Six other response-only checks cover missing/invalid IDs, disconnected service, refused write and refused secret disclosure. See `agent-tests.json` for exact responses and evidence boundaries.

The public repository is https://github.com/Smiledangers/agentplace-store-api . The live review URL is https://rsauoya2i1d0.run.agentplace.io/ . A submission draft is prepared; no application email has been sent because the recipient address awaits the owner’s confirmation.

The backend tunnel requires the local task runtime to remain running. It is not a permanent hosting deployment. The Dockerfile supports a future stable HTTPS deployment without changing the API contract.
