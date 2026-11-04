// Stress test: login, then hammer protected endpoints with concurrency.
// Usage: node stress-test.js [concurrency] [requestsPerWorker]
const http = require('http');

const BASE = 'http://localhost:3000';
const CONCURRENCY = Number(process.argv[2]) || 50;
const PER_WORKER = Number(process.argv[3]) || 20;

const ENDPOINTS = [
  '/api/students',
  '/api/teachers',
  '/api/grades',
  '/api/attendances',
  '/api/schedules',
  '/api/announcements',
  '/api/bills',
  '/api/settings/help-contacts',
];

function request(path, options = {}) {
  return new Promise((resolve) => {
    const started = process.hrtime.bigint();
    const req = http.request(
      `${BASE}${path}`,
      { method: options.method || 'GET', headers: options.headers || {}, timeout: 10000 },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          const ms = Number(process.hrtime.bigint() - started) / 1e6;
          resolve({ status: res.statusCode, ms, body });
        });
      }
    );
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, ms: Number(process.hrtime.bigint() - started) / 1e6, error: 'timeout' }); });
    req.on('error', (e) => resolve({ status: 0, ms: Number(process.hrtime.bigint() - started) / 1e6, error: e.message }));
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function login() {
  const body = JSON.stringify({ email: 'admin@example.com', password: 'Password123' });
  const res = await request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
    body,
  });
  if (res.status !== 200) throw new Error(`Login failed: ${res.status} ${res.body}`);
  return JSON.parse(res.body).token;
}

function pct(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx].toFixed(1);
}

(async () => {
  console.log(`Stress test: ${CONCURRENCY} workers x ${PER_WORKER} requests = ${CONCURRENCY * PER_WORKER} total`);
  const token = await login();
  console.log('Login OK, token acquired');

  const auth = { Authorization: `Bearer ${token}` };
  const results = { authed: [], unauthed: [], badToken: [] };

  const started = Date.now();

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async (_, w) => {
      for (let i = 0; i < PER_WORKER; i++) {
        const ep = ENDPOINTS[(w + i) % ENDPOINTS.length];
        const kind = i % 3 === 0 ? 'authed' : i % 3 === 1 ? 'unauthed' : 'badToken';
        const headers = kind === 'authed' ? auth : kind === 'badToken' ? { Authorization: 'Bearer invalid.token.value' } : {};
        const res = await request(ep, { headers });
        results[kind].push({ ...res, ep });
      }
    })
  );

  const elapsed = Date.now() - started;
  const all = [...results.authed, ...results.unauthed, ...results.badToken];
  const latencies = all.map((r) => r.ms).sort((a, b) => a - b);
  const errors = all.filter((r) => r.status === 0).length;
  const rateLimited = all.filter((r) => r.status === 429).length;

  const statusCount = {};
  for (const r of all) statusCount[r.status] = (statusCount[r.status] || 0) + 1;

  console.log('\n--- Results ---');
  console.log(`Duration: ${elapsed} ms`);
  console.log(`Throughput: ${((all.length / elapsed) * 1000).toFixed(1)} req/s`);
  console.log(`Status codes:`, statusCount);
  console.log(`Connection errors: ${errors}`);
  console.log(`Rate-limited (429): ${rateLimited}`);
  console.log(`Latency ms p50=${pct(latencies, 50)} p90=${pct(latencies, 90)} p99=${pct(latencies, 99)} max=${pct(latencies, 100)}`);

  const authedUnexpected = results.authed.filter((r) => r.status !== 200 && r.status !== 429 && r.status !== 0);
  const unauthedUnexpected = results.unauthed.filter((r) => r.status !== 401 && r.status !== 429 && r.status !== 0);
  const badTokenUnexpected = results.badToken.filter((r) => r.status !== 403 && r.status !== 429 && r.status !== 0);

  console.log(`\nAuth check: ${results.authed.length} authed reqs, ${authedUnexpected.length} unexpected (want 200)`);
  console.log(`No-token check: ${results.unauthed.length} reqs, ${unauthedUnexpected.length} unexpected (want 401)`);
  console.log(`Bad-token check: ${results.badToken.length} reqs, ${badTokenUnexpected.length} unexpected (want 403)`);

  if (authedUnexpected.length) console.log('Sample authed failure:', authedUnexpected.slice(0, 3));
  if (unauthedUnexpected.length) console.log('Sample no-token failure:', unauthedUnexpected.slice(0, 3));

  const pass = errors === 0 && authedUnexpected.length === 0 && unauthedUnexpected.length === 0 && badTokenUnexpected.length === 0;
  console.log(pass ? '\nSTRESS TEST PASSED' : '\nSTRESS TEST FAILED');
  process.exit(pass ? 0 : 1);
})();
