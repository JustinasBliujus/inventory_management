export function requireLogin() {
  return function (req, res, next) {
    if (req.session && req.session.user) {
      next();
    } 
    else 
    {
      res.status(401).json({ message: 'User is not logged in' });
    }
  };
}

export function requireUnblocked() {
  return function (req, res, next) {
    if (req.session.user.status !== "blocked") {
      next();
    } 
    else 
    {
      return res.status(403).json({ message: 'User is blocked' });
    }
  };
}

export function requireAdmin() {
  return function (req, res, next) {
    const user = req.session.user;
    if (!user || !user.is_admin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    } 
    else 
    {
      next();
    }
  };
}
