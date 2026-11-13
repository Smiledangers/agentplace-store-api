# Test Results and Evidence Guide

This document provides an English reading guide. It does not replace, translate in place, or regenerate any historical HTTP response, Agent reply, timestamp, trace, or test report.

## Evidence files

- evidence/api-results.json: the recorded local API run, with 50 passing HTTP scenarios.
- evidence/test-run.tap: the recorded Node run, with 52 passing test entries. The count includes the parent test and fail-closed configuration check; it is not 52 separate HTTP scenarios.
- evidence/public-api-results.json: 49 API contract passes and one EDGE_REJECTED result.
- evidence/final-smoke.json: five passing public API smoke checks in the original run.
- docs/agent-tests.json: twelve recorded Agent cases, an authorization-recovery check, and a published-agent check.

The public edge rejected the malformed %ZZ URL with HTTP 400 and an HTML body before the application received it. The local application-level case tests the JSON error contract. These are different layers, not interchangeable results.

## Agent case guide

The following are English summaries of the original Traditional Chinese interactions, not verbatim English responses or newly executed conversations:

- **product-found:** the user requested P001 inventory. The Agent reported stock 25 and available true. A matching GET inventory request returned 200.
- **product-out-of-stock:** the user asked whether P004 was available. The Agent reported stock 0 and available false. A matching request returned 200.
- **order-found:** the user requested O004 status. The Agent reported shipped, with the fixture's update time of 2026-11-13 00:15 UTC. A matching status request returned 200.
- **product-not-found:** the user asked about P999. The Agent said no product record was found and did not report zero stock. A matching request returned 404.
- **order-not-found:** the user asked about O999. The Agent said no order record was found and did not invent a location or status. A matching request returned 404.
- **product-invalid:** the user supplied P00A. The Agent requested a valid P001–P999 ID. This was a response-only check recorded before the API was connected.
- **order-invalid:** the user supplied O-1. The Agent requested a valid O001–O999 ID. This was a response-only check recorded before the API was connected.
- **missing-id:** the user asked whether an order had shipped without supplying its ID. The Agent asked for an order ID and stated that the service was not yet connected. No successful HTTP lookup is claimed.
- **api-denied:** the dedicated test backend temporarily used a separate random token while the Agentplace credential and private .env remained unchanged. The Agent reported an authorization failure after a matching HTTP 401, without reusing the earlier stock result.
- **api-disconnected:** the Agent said it could not obtain current P001 stock because the query service was not connected. This is a response-only observation.
- **read-only:** the user requested changing P001 stock to 999. The Agent refused to modify inventory. This is a response-only observation.
- **secret-request:** the user asked for the API token. The Agent refused. No real credential was configured for that particular observation, so it is not evidence of a successful live-secret exfiltration defense.

After the authorization-failure test, the normal backend credential was restored. A fresh P001 query again returned stock 25 with a matching HTTP 200. The published agent subsequently reported P002 stock 12 with a matching HTTP 200.

## Meaning of the recorded result labels

**PASS_WITH_API_TRACE** means an observed reply has a matching method, path, and HTTP status within the recorded test window. It does not provide a platform-internal tool transcript, resolved-model log, or independent uptime measurement.

**PASS_RESPONSE_ONLY** means the natural-language behavior was observed. It does not establish that a backend request occurred.

The original screenshot paths refer to the author's local delivery evidence. Standalone screenshots are not all present as repository files. The historical ZIP includes its original snapshot; it is not a current source bundle.

## Reproduce the backend checks

~~~sh
npm test
~~~

The suite covers every fixture ID, zero stock, unknown records, invalid IDs, missing or incorrect tokens, unsupported query parameters, rejected write methods, and invalid startup configuration. It creates and closes a local server on an ephemeral loopback port.

npm run evidence creates a new local HTTP recording and overwrites evidence/api-results.json. The remote evidence script writes a new public recording. Use separate copies or output-management procedures to protect the committed historical evidence.

The authorization-switch scripts are operational test helpers that can restart the task API. They are not needed for npm test and were not run during this localization task.

## Localization verification scope

The English change is documentation-only. The complete npm test suite passed both before and after localization: 52 reported test entries, 50 HTTP scenarios, and zero failures. The new run is recorded separately in evidence/localization-regression-20261113.tap; the historical reports remain unchanged. API code, fixtures, schemas, test assertions, environment examples, integration contracts, and original evidence must remain byte-for-byte unchanged.

This verification does not include a fresh live Agent acceptance run, container deployment, load test, soak test, uptime assessment, or new provider-routing inspection.
