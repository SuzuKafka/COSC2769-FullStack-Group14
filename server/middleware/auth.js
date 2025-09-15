/**
 * Session-based auth guards for the COSC2769 project.
 */
function requireLogin(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  req.user = req.session.user;
  return next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ error: 'Forbidden.' });
    }

    req.user = req.session.user;
    return next();
  };
}

module.exports = {
  requireLogin,
  requireRole,
};
