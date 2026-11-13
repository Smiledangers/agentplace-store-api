# Deployment Guide

## Current demonstration arrangement

The recorded review setup is a local Node.js process on 127.0.0.1:43187, exposed through a temporary Cloudflare quick tunnel. The last recorded origin is:

https://downtown-greg-recorders-husband.trycloudflare.com

This is a historical configuration reference, not a promise that the address is currently reachable. A quick tunnel depends on its connector process and local machine, and a newly created tunnel can receive a different hostname. The original integration run included a tunnel interruption and subsequent recovery.

This localization task does not restart the API or tunnel, change Agentplace settings, or verify current live availability.

## Local configuration

The existing settings are:

- STORE_API_KEY: required; at least 32 non-whitespace characters.
- HOST: defaults to 127.0.0.1.
- PORT: defaults to 43187; must be an integer from 1 through 65535.

Use a private .env file for local development. npm start reads it if present. The service refuses invalid credentials and exits on a port-binding error. Select a free port rather than terminating another service.

The author used 43187 to avoid an existing website on port 3000. This repository's documentation does not authorize changing that website.

## Container example

The existing Dockerfile uses node:22-alpine, runs as the node user, and exposes port 43187. It requires an injected token.

~~~sh
docker build -t agentplace-store-api .
docker run --rm --env-file .env -e HOST=0.0.0.0 -e PORT=43187 -p 127.0.0.1:43187:43187 agentplace-store-api
~~~

The explicit HOST override is needed if .env contains HOST=127.0.0.1; the service must listen on the container interface for port forwarding. The host-side binding above is loopback-only. Choose a different host port if 43187 is already occupied.

These are setup examples. A container build or production deployment was not performed as part of this documentation-only change.

## Requirements for stable hosting

Before treating the demonstration as an always-on review environment:

1. Use a host independent of a personal workstation, with a fixed HTTPS address.
2. Configure process supervision or the hosting platform's restart policy.
3. Monitor GET /health, startup failures, and externally visible availability.
4. Inject STORE_API_KEY through the platform's private environment settings.
5. Terminate TLS at a managed HTTPS endpoint or reverse proxy.
6. Configure the intended HOST and PORT without occupying another service's port.
7. Update the OpenAPI server entry and Agentplace STORE_API_BASE_URL to the actual deployment origin.
8. Revalidate authorization, successful lookups, missing records, and Agent behavior after deployment.

These steps are recommendations for a separate deployment task; they are not implemented or claimed here. The current /health route only reports that the application can respond. It is not a comprehensive readiness or dependency check.

## Agentplace settings

The server-side lookup tool reads STORE_API_BASE_URL and STORE_API_TOKEN. STORE_API_TOKEN must equal the backend's STORE_API_KEY; enter the raw value without the Bearer prefix.

See AGENTPLACE.md for the recorded platform workflow. Never commit .env, copy a token into a public prompt, or include credentials in an application email.

## Operational limits

The service has no persistent database, write API, customer identity checks, rate limiter, or configured high-availability topology. No load test, soak test, disaster-recovery exercise, or uptime measurement is recorded. The Dockerfile alone does not establish deployment stability.
