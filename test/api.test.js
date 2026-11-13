import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
import { cases, runCase } from './cases.js';

test('configuration fails closed', () => {
  for (const apiKey of [undefined, '', 'short', ' '.repeat(32)]) assert.throws(() => createServer({ apiKey }));
});
test('HTTP API contract and access control', async t => {
  const apiKey = 'test-only-key-012345678901234567890';
  const server = createServer({ apiKey });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    for (const scenario of cases) await t.test(scenario.name, async () => {
      await runCase(`http://127.0.0.1:${server.address().port}`, apiKey, scenario);
    });
  } finally { await new Promise(resolve => server.close(resolve)); }
});
