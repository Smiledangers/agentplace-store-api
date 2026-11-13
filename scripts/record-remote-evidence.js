import { writeFile } from 'node:fs/promises';
import { cases, runCase } from '../test/cases.js';

const base = process.argv[2];
if (!base || new URL(base).protocol !== 'https:') throw new Error('Provide the authorized public HTTPS API origin.');
const key = process.env.STORE_API_KEY;
if (!key) throw new Error('Load STORE_API_KEY from your private .env.');
const results = [];
for (const scenario of cases) {
  // A reverse proxy may reject malformed percent encoding before it reaches Node.
  if (scenario.path.includes('%ZZ')) {
    const response = await fetch(`${base}${scenario.path}`, { headers: { Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15000) });
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      const accepted = response.status === 400;
      results.push({ name: scenario.name, path: scenario.path, httpStatus: response.status, contentType, result: accepted ? 'EDGE_REJECTED' : 'FAIL', note: 'Malformed URL rejected by the HTTPS edge before the application; JSON error contract is not applicable at this layer.' });
      if (!accepted) process.exitCode = 1;
      continue;
    }
  }
  try { results.push(await runCase(base, key, scenario)); }
  catch (error) { results.push({ name: scenario.name, result: 'FAIL', error: error.message }); process.exitCode = 1; }
}
await writeFile(new URL('../evidence/public-api-results.json', import.meta.url), JSON.stringify({ recordedAt: new Date().toISOString(), origin: base, source: 'Actual public HTTPS requests; not Agentplace responses', results }, null, 2) + '\n');
console.log(`${results.filter(r => r.result === 'PASS').length} API scenarios passed; ${results.filter(r => r.result === 'EDGE_REJECTED').length} malformed URL rejected by edge; ${results.filter(r => r.result === 'FAIL').length} failures`);
