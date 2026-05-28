const jwt = require('jsonwebtoken');

/* Middleware проверки токена администратора */
const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Токен не предоставлен' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Доступ запрещён' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Недействительный токен' });
  }
};

module.exports = adminAuthMiddleware;
