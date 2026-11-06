// Removes rows created by smoke-roles.mjs.
const db = require('./database');
db.prepare("DELETE FROM students WHERE niup LIKE 'SMOKE-%'").run();
db.prepare("DELETE FROM ekskul WHERE nama = 'Smoke Ekskul'").run();
console.log('cleaned');
