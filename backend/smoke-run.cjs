// Runs the API smoke test against a temporary server process.
const { spawn } = require('child_process');
const path = require('path');

const server = spawn(process.execPath, [path.join(__dirname, 'server.js')], {
  cwd: __dirname,
  stdio: ['ignore', 'pipe', 'pipe'],
});
server.stdout.on('data', () => {});
server.stderr.on('data', (d) => process.stderr.write(d));

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  await wait(2500);
  const child = spawn(process.execPath, [path.join(__dirname, 'smoke-roles.mjs')], {
    cwd: __dirname,
    stdio: 'inherit',
  });
  child.on('exit', (code) => {
    server.kill('SIGTERM');
    process.exit(code ?? 0);
  });
})();
