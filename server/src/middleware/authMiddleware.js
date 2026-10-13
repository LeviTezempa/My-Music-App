
// Makes sure the user is logged in before he can modify the any data.
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Grab token from request headers
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract "TOKEN" out of "Bearer TOKEN"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Inject decoded user identifier into request
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is invalid or expired' });
  }
};
