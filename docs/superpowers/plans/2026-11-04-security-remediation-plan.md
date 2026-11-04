# Security Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical, high, and medium security vulnerabilities identified in `SECURITY-AUDIT.md` (auth bypass, missing data scoping, BOLA, injection, broken require paths) safely without breaking existing features.

**Architecture:** Add `authenticateToken` and role authorization middleware to all unauthenticated backend data routes, implement user-scoped data filtering in SQL queries, fix broken require paths, and sanitize search LIKE wildcards.

**Tech Stack:** Node.js, Express 5, better-sqlite3, JWT, Vue 3, Pinia.

**Spec:** `SECURITY-AUDIT.md`

## Global Constraints
- Every API endpoint that handles sensitive data or mutations must verify the JWT token via `authenticateToken`.
- Database queries must not use unescaped user input in SQL statements.
- Role checks must enforce tenant/user-scoped data isolation (students see only their own data, parents see only their children's data, teachers see their assigned scope, admins see all).
- Existing test workflows and frontend routing must remain fully functional.

## Review Focus
1. **Unauthenticated access after patch**: Does any student/teacher/grade/attendance endpoint still respond without a valid Bearer token?
2. **Cross-tenant data leakage (BOLA)**: Can a student query another student's grades or bills by changing IDs in query params?
3. **LIKE pattern injection**: Can an attacker abuse `%` or `_` in search queries to extract unintended records?
4. **Broken require paths**: Are all middleware imports correctly resolved without runtime `MODULE_NOT_FOUND` errors?
5. **Frontend route guard mismatch**: Do frontend stores handle 401/403 responses gracefully by redirecting to login when tokens expire?

---

### Task 1: Fix Payment Routes Require Path & Create Role Middleware Factory

**Files:**
- Modify: `backend/routes/paymentRoutes.js`
- Create: `backend/middleware/roleCheck.js`
- Test: `backend/server.js` (startup check)

**Interfaces:**
- Consumes: `backend/middleware/auth.js`
- Produces: `backend/middleware/roleCheck.js` (`authorizeRoles(...allowedRoles)`)

- [ ] **Step 1: Create `backend/middleware/roleCheck.js`**

```javascript
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Akses ditolak: Hak akses tidak memadai' });
    }
    next();
  };
};

module.exports = authorizeRoles;
```

- [ ] **Step 2: Update `backend/routes/paymentRoutes.js` require paths**

Change:
```javascript
const authMiddleware = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');
```
To:
```javascript
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
```

- [ ] **Step 3: Verify server starts cleanly without module not found errors**

Run: `node -e "require('./backend/server.js'); console.log('OK')" --timeout 3000`
Expected: Server starts or requires env without throwing MODULE_NOT_FOUND for middleware.

- [ ] **Step 4: Commit**

```bash
git add backend/middleware/roleCheck.js backend/routes/paymentRoutes.js
git commit -m "fix: resolve incorrect middleware paths and add roleCheck factory"
```

---

### Task 2: Secure Students and Teachers Routes with Authentication & Scoping

**Files:**
- Modify: `backend/routes/students.js`
- Modify: `backend/routes/teachers.js`

**Interfaces:**
- Consumes: `backend/middleware/auth.js`, `backend/middleware/roleCheck.js`
- Produces: Secured `/api/students` and `/api/teachers` endpoints with user scoping.

- [ ] **Step 1: Add authentication and role checks to `backend/routes/students.js`**

Import `authenticateToken` and `authorizeRoles`. Apply `authenticateToken` to all routes. For students, if `req.user.role === 'student'`, force `req.query.studentId = req.user.id` or restrict list view.

- [ ] **Step 2: Add authentication and role checks to `backend/routes/teachers.js`**

Apply `authenticateToken`. Restrict teacher management (POST/PUT/DELETE) to `admin` role.

- [ ] **Step 3: Test student route protection via node fetch**

Run: `node -e "fetch('http://localhost:3000/api/students').then(r => console.log(r.status))"`
Expected: `401`

- [ ] **Step 4: Commit**

```bash
git add backend/routes/students.js backend/routes/teachers.js
git commit -m "security: add auth and role checks to students and teachers routes"
```

---

### Task 3: Secure Grades, Attendances, Schedules, and Announcements Routes

**Files:**
- Modify: `backend/routes/grades.js`
- Modify: `backend/routes/attendances.js`
- Modify: `backend/routes/schedules.js`
- Modify: `backend/routes/announcements.js`

**Interfaces:**
- Consumes: `backend/middleware/auth.js`, `backend/middleware/roleCheck.js`

- [ ] **Step 1: Apply `authenticateToken` to grades, attendances, schedules, and announcements routes.**
- [ ] **Step 2: Add data-scoping so students can only read their own grades/attendances.**
- [ ] **Step 3: Commit**

```bash
git add backend/routes/grades.js backend/routes/attendances.js backend/routes/schedules.js backend/routes/announcements.js
git commit -m "security: secure academic routes with authentication and user scoping"
```

---

### Task 4: Sanitize LIKE Wildcards in Search Queries

**Files:**
- Modify: `backend/routes/students.js`
- Modify: `backend/routes/teachers.js`
- Modify: `backend/routes/announcements.js`

- [ ] **Step 1: Implement wildcard escaping helper function**

```javascript
const sanitizeLike = (str) => str.replace(/[%_]/g, '\\$&');
```
- [ ] **Step 2: Apply to search parameters in students, teachers, and announcements.**
- [ ] **Step 3: Commit**

```bash
git add backend/routes/students.js backend/routes/teachers.js backend/routes/announcements.js
git commit -m "security: sanitize SQL LIKE wildcards in search parameters"
```

---

### Task 5: End-to-End Verification and Testing

**Files:**
- Test: All backend routes via test script.

- [ ] **Step 1: Run automated smoke test script verifying unauthenticated requests return 401**

```javascript
// test-security.js
(async () => {
  const endpoints = ['/api/students', '/api/teachers', '/api/grades', '/api/attendances', '/api/schedules', '/api/announcements', '/api/bills'];
  for (const ep of endpoints) {
    const res = await fetch(`http://localhost:3000${ep}`);
    console.log(`${ep} -> ${res.status} (Expected 401)`);
    assert(res.status === 401);
  }
  console.log('All security smoke tests PASSED');
})();
```

- [ ] **Step 2: Run test script and confirm output.**
- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "test: add security smoke tests verifying 401 on protected routes"
```
