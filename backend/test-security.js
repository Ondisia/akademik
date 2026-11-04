const http = require('http');

const endpoints = [
  '/api/students',
  '/api/teachers',
  '/api/grades',
  '/api/attendances',
  '/api/schedules',
  '/api/announcements',
  '/api/bills'
];

const baseUrl = 'http://localhost:3000';

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(3000, () => { req.destroy(); reject(new Error('timeout')); });
  });
}

(async () => {
  let allPassed = true;
  for (const ep of endpoints) {
    try {
      const res = await get(ep);
      const passed = res.status === 401;
      console.log(`${ep} -> ${res.status} ${passed ? 'PASS (401)' : 'FAIL (expected 401)'}`);
      if (!passed) allPassed = false;
    } catch (err) {
      console.log(`${ep} -> ERROR: ${err.message} (server mungkin belum berjalan)`);
      allPassed = false;
    }
  }
  console.log(allPassed ? '\nAll security smoke tests PASSED' : '\nSome tests FAILED');
  process.exit(allPassed ? 0 : 1);
})();
