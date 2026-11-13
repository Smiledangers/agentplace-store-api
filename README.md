# Store Inventory and Order Status Agent

A small, read-only store API built for the Agentplace Backend Engineer exercise. The service provides inventory and order-status lookups for **10 synthetic products and 10 synthetic orders**, with input validation, Bearer-token authorization, and explicit error responses.

- **Source:** https://github.com/Smiledangers/agentplace-store-api
- **Published Agent:** https://rsauoya2i1d0.run.agentplace.io/
- **Runtime:** Node.js 22 or later; no third-party runtime dependencies.
- **Deployment status:** demonstration only. The recorded deployment uses a local process and a temporary Cloudflare tunnel; it is not an always-on production deployment.

## Architecture

1. A visitor asks the Agentplace agent about a product or order.
2. A dedicated server-side lookup tool sends a GET request to one of the two fixed API routes, with an Authorization header.
3. The Node.js service authenticates the caller, validates the request, and reads the matching record from JSON fixtures loaded at startup.
4. The tool maps the API result to an agent response. Successful answers must use a fresh API result; missing records and failed requests must not be presented as successful lookups.

The agent's selected Luna configuration is described in [Model configuration](docs/MODEL.md). The generated Agentplace runtime is managed on that platform; this repository contains the backend, its contract, setup instructions, and recorded integration evidence.

## API and authorization

- GET /api/products/{productId}/inventory — product ID, name, stock, and availability.
- GET /api/orders/{orderId}/status — order ID, status, and last-update timestamp.
- GET /health — public process-health response.
- GET /openapi.json — public OpenAPI document.

Protected routes require **Authorization: Bearer YOUR_API_TOKEN**. The service token must contain at least 32 non-whitespace characters. The application refuses to start with a missing or invalid token.

Product IDs use P001–P999; order IDs use O001–O999. The fixtures contain P001–P010 and O001–O010. IDs are case-sensitive; 000 is invalid. Query parameters and write operations are not supported.

Success responses contain a data object. Error responses contain an error object with code and message fields. The main error statuses are 400 for invalid input, 401 for missing or incorrect authorization, 404 for an absent record or route, and 405 for an authenticated request using an unsupported method. Authentication precedes route and parameter validation, except for the two public GET routes.

See [API contract](docs/API.md) and [openapi.json](openapi.json) for details.

## Install and run

Run the following commands in a new checkout:

~~~sh
git clone https://github.com/Smiledangers/agentplace-store-api.git
cd agentplace-store-api
~~~

Create a private environment file without printing the generated token:

~~~sh
node -e "const fs=require('node:fs'),crypto=require('node:crypto'); fs.writeFileSync('.env','STORE_API_KEY='+crypto.randomBytes(32).toString('hex')+'\nHOST=127.0.0.1\nPORT=43187\n',{flag:'wx'});"
npm start
~~~

No npm install step is required. The file-creation command intentionally fails if .env already exists; review the existing configuration instead of overwriting a working credential. The default local address is http://127.0.0.1:43187. Choose an unused port if necessary; a bind failure does not replace an existing service.

In another terminal, run an authenticated example from the repository root:

~~~sh
node --env-file=.env --input-type=module -e "const r=await fetch('http://127.0.0.1:43187/api/products/P001/inventory',{headers:{Authorization:'Bearer '+process.env.STORE_API_KEY}}); console.log(r.status,await r.json());"
~~~

Other useful lookups are /api/products/P004/inventory (zero stock) and /api/orders/O004/status (shipped). Product names remain in their original fixture language; localization does not change business data or API values.

## Run the tests

~~~sh
npm test
~~~

The suite uses isolated, ephemeral loopback ports. It does not need the demonstration server, a Cloudflare tunnel, or an Agentplace account.

To generate a **new** local API evidence run:

~~~sh
npm run evidence
~~~

That command overwrites evidence/api-results.json. Use a separate working copy if the historical recording must be preserved.

The committed baseline reports 50 HTTP scenarios and 52 passing Node test entries, including the parent test and configuration checks. The historical public HTTPS run reports 49 API contract passes and one malformed URL rejected by the Cloudflare edge before reaching the application.

See [Test results and evidence guide](docs/TEST_RESULTS.md) for the exact scope of each report and an English guide to the original Agent responses.

## Deployment and Agentplace integration

For stable review access, deploy the service to an independently managed host with a fixed HTTPS address, a supervised process or container, restart handling, and health monitoring. Inject STORE_API_KEY through the hosting environment.

Configure the Agentplace server-side tool with:

- STORE_API_BASE_URL — the public HTTPS origin.
- STORE_API_TOKEN — the same raw token used by the backend; the tool adds the Bearer prefix.

Never put a real token in frontend code, repository files, chat messages, or submission emails. See [Deployment guide](docs/DEPLOYMENT.md) and [Agentplace setup](docs/AGENTPLACE.md).

## Evidence and known limitations

- All business records are synthetic. The shared token grants service-level read access; customer login and order-ownership checks are not implemented.
- JSON fixtures are loaded into memory at startup. There is no database or write interface.
- The temporary tunnel depends on the local machine, network, and task processes. Restarting it can change the hostname. Passing functional tests does not establish uptime, load capacity, or a service-level objective.
- Historical Agent replies were recorded in Traditional Chinese. [The English evidence guide](docs/TEST_RESULTS.md) provides explanatory translations; the original JSON, HTTP responses, timestamps, traces, and archive remain unchanged.
- Six core Agent cases include observed replies and matching HTTP traces. Six additional cases verify response behavior only. Recovery and a published-agent lookup are recorded separately. These categories are not interchangeable.
- The generated Agentplace runtime and resolved model routing are not independently reproduced by this repository's Node test suite.
- The ZIP at the repository root is an **initial historical snapshot**. Review the expanded main-branch source and its documentation for the current version.
- Submission email remains an unsent draft pending recipient confirmation.

Start with [Reviewer quick start](docs/REVIEWER.md) or [Delivery status](docs/DELIVERY.md). This documentation update does not change the live deployment or Agentplace configuration.
