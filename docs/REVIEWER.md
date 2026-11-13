# Reviewer Quick Start

This repository implements the API portion of the Agentplace Backend Engineer exercise and includes recorded integration evidence. All business records are synthetic.

1. Use Node.js 22 or later. No third-party runtime dependencies need to be installed.
2. Follow README.md to create a private .env and start the service. The default local port is 43187.
3. Query GET /api/products/P001/inventory or GET /api/orders/O004/status using a valid Bearer token.
4. Run npm test. The suite uses an isolated ephemeral server and does not require the live demonstration.
5. Read API.md for the existing request and response contract.
6. Read TEST_RESULTS.md for an English guide to the original observations and their limits.

## What the evidence supports

The historical local run contains 50 passing HTTP scenarios. The Node runner reports 52 passing entries, including the parent test and fail-closed configuration check.

The historical public HTTPS run contains 49 application-contract passes and one malformed URL rejected at the Cloudflare edge. Six core Agent cases have observed replies with matching HTTP traces; six other cases verify response behavior only. Recovery and a published-agent lookup are recorded separately.

Original responses, timestamps, and traces have not been rewritten. Some source evidence and fixture names remain in Traditional Chinese. TEST_RESULTS.md supplies English explanations without presenting them as new English-language test runs.

## What remains limited

The shared token grants service-level access to synthetic data. There are no customer accounts or order-ownership checks. JSON fixtures are loaded at startup; there is no database or write interface.

The published agent is https://rsauoya2i1d0.run.agentplace.io/. Its backend uses a temporary local tunnel. A permanent backend, uptime guarantee, load-capacity claim, and production-readiness claim are not established. See DEPLOYMENT.md.

The reported Luna configuration is documented in MODEL.md. Per-request provider routing and billing were not independently inspected.

The root ZIP is an initial snapshot; the expanded main-branch files are the current review target. The application email remains an unsent draft. No live settings or email are changed by this documentation-only localization.
