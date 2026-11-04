# Stress Test & Page Check Report

**Date:** 2026-11-04
**Scope:** Backend API (`http://localhost:3000`), Frontend SPA (`http://localhost:5173`)
**Build under test:** `8df53b0` + multer dependency added
**Tools:** Node.js load script, Chrome DevTools (console, network, DOM snapshots, screenshots)

---

## 1. API Stress Test

Script: `backend/stress-test.js`
Mix per request cycle: authenticated GET, no-token GET, invalid-token GET.

### Run A — 1.000 requests (50 workers × 20)

| Metric | Result |
|---|---|
| Duration | 553 ms |
| Throughput | 1.808 req/s |
| Status codes | 200: 350, 401: 350, 403: 300 |
| Connection errors | 0 |
| Latency p50 / p90 / p99 / max | 24,4 / 34,1 / 72,0 / 75,6 ms |
| Auth correctness | 350/350 (200), 350/350 (401), 300/300 (403) |

### Run B — 3.000 requests (100 workers × 30)

| Metric | Result |
|---|---|
| Duration | 1.410 ms |
| Throughput | 2.128 req/s |
| Status codes | 200: 1.000, 401: 1.000, 403: 1.000 |
| Connection errors | 0 |
| Latency p50 / p90 / p99 / max | 44,2 / 60,0 / 93,9 / 105,2 ms |
| Auth correctness | 100 % on all three classes |

**Verdict:** PASS. No dropped connections, no 5xx, rate of wrong authorization decisions = 0.

> Note: the active server (`backend/server.js`) has no rate limiter, so no 429 responses appeared. `backend/app.js` contains a limiter but is not the active entry point.

---

## 2. Page Check (Chrome DevTools)

Login: `admin@example.com` / `Password123`. All 10 routes opened through SPA navigation.

| Page | Route | Rendered | Console errors | Failed requests |
|---|---|---|---|---|
| Dashboard | `/dashboard` | OK | 0 | 0 |
| Siswa | `/students` | OK | 0 | 0 |
| Kelas | `/classes` | OK | 0 | 0 |
| Guru | `/teachers` | OK | 0 | 0 |
| Jadwal | `/schedule` | OK | 0 | 0 |
| Absensi | `/attendance` | OK | 0 | 0 |
| Nilai | `/grades` | OK | 0 | 0 |
| Pengumuman | `/announcements` | OK | 0 | 0 |
| Komunikasi | `/communication` | OK | 0 | 0 |
| Tagihan | `/billing` | OK | 0 | 0 |

- No failed network request in 87 recorded requests (all 200/204/304).
- Console holds only accessibility notices: form fields without label/id/autocomplete. No JS exceptions.
- Layout verified at 1440×900 and 390×844. Sidebar collapses to hamburger on mobile; no horizontal overflow.
- `npm run build` succeeded (77 modules, 4,98 s, 250,69 kB JS before gzip).

---

## 3. Findings

### F-ST-01 — Hard reload on a protected page forces logout (MEDIUM, pre-existing)
File: `frontend/src/router/index.ts:83-98`

```ts
if (!authStore.isAuthenticated) {
  authStore.initAuth()          // async, not awaited
}
if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  next('/login')                // runs while initAuth is still pending
}
```

Reproduced: after login, `F5` on `/dashboard` lands on `/login` although a valid token and user remain in `localStorage`. Token validation (`GET /api/auth/me`) resolves after the redirect decision.

Fix: make the guard async and `await authStore.initAuth()`, or read the token synchronously before the first navigation.

### F-ST-02 — Payment subsystem is dead code (LOW)
- `backend/routes/paymentRoutes.js` is never mounted in `backend/server.js`.
- `backend/controllers/paymentController.js:2` requires `../models`, which has no `index.js`. It also uses Sequelize models while the active stack is `better-sqlite3`.
- `frontend/src/views/PaymentsView.vue` and `stores/paymentStore.js` are not referenced by the router; billing uses `BillingPage.vue` + `stores/billing.ts`.

`multer` is now installed (`^2.5.0`), but the payment route still cannot load because of the missing models index. This subsystem needs either removal or a rewrite onto SQLite. It is not reachable at runtime today, so it does not affect the tested flows.

### F-ST-03 — Dev-only dependency advisory (LOW)
`npm audit`: 2 moderate issues, both via `nodemon → minimatch < 11.0.1` (DoS in glob patterns). Dev dependency only; not shipped with the runtime. `npm audit fix --force` would downgrade nodemon to 1.0.2, so leave it until nodemon ships a new release.

---

## 4. Verdict

Security patches hold under load. API authorization behaves exactly as designed at 2.128 req/s with zero errors, and every screen renders cleanly on desktop and mobile. The two functional issues found (reload logout, dead payment module) predate this work and are documented above.

---

## 5. Resolution (2026-11-04)

| ID | Status | Change |
|---|---|---|
| F-ST-01 | Fixed | `frontend/src/router/index.ts` — guard is now `async` and `await`s `authStore.initAuth()`. Verified: reload on `/dashboard` stays on `/dashboard` with a valid token. |
| F-ST-02 | Fixed (removed) | Deleted dead payment subsystem: `backend/routes/paymentRoutes.js`, `backend/controllers/paymentController.js`, `frontend/src/views/PaymentsView.vue`, `frontend/src/stores/paymentStore.js`. Removed the now-unused `multer` dependency. Active billing stays on `routes/billings.js` + `BillingPage.vue`. |
| F-ST-03 | Accepted | `nodemon` (dev-only) still pulls `minimatch <11`. Latest `nodemon@3.1.14` still declares `minimatch ^10.2.1`, so no safe upgrade exists. No runtime exposure. |

### Seed data

`backend/scripts/seedDemo.js` (`npm run seed`) inserts 12 students, 5 teachers, 12 schedules, 36 grades, 84 attendance rows, 36 bills, 3 announcements, demo accounts for all four roles, and default help contacts. Idempotent by deterministic primary keys + `INSERT OR IGNORE`.

### Re-verification after fixes

- `npm run build` (frontend): PASS, 5,55 s.
- Stress test 3.000 requests: 1.649 req/s, 0 errors, 200/401/403 all correct.
- All 10 pages rechecked with seeded data; no console errors, no failed requests.
