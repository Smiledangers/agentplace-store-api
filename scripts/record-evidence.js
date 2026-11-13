import { mkdir, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { createServer } from '../src/server.js';
import { cases, runCase } from '../test/cases.js';

const key = randomBytes(32).toString('hex');
const server = createServer({ apiKey: key });
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const results = [];
try {
  for (const scenario of cases) {
    try { results.push(await runCase(`http://127.0.0.1:${server.address().port}`, key, scenario)); }
    catch (error) { results.push({ name: scenario.name, result: 'FAIL', error: error.message }); process.exitCode = 1; }
  }
} finally { await new Promise(resolve => server.close(resolve)); }
await mkdir(new URL('../evidence/', import.meta.url), { recursive: true });
await writeFile(new URL('../evidence/api-results.json', import.meta.url), JSON.stringify({ recordedAt: new Date().toISOString(), source: 'Actual local HTTP requests; not Agentplace responses', results }, null, 2) + '\n');
console.log(`${results.filter(r => r.result === 'PASS').length}/${results.length} API scenarios passed`);
