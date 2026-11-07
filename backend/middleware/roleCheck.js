const { hasAnyRole } = require('../scope');

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !hasAnyRole(req.user, roles)) {
    return res.status(403).json({ message: 'Akses ditolak' });
  }
  next();
};

module.exports = authorizeRoles;
