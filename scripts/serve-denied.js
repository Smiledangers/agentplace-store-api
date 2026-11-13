// Dedicated authorization-failure fixture. Never load the real service token.
import { randomBytes } from 'node:crypto';
import { createServer } from '../src/server.js';

const server = createServer({ apiKey: randomBytes(32).toString('hex'), audit: entry => console.log(JSON.stringify(entry)) });
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(43187, '127.0.0.1', () => console.log('Test-only denial API listening on port 43187'));
