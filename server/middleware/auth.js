// Simple authentication middleware for prototype
const auth = (req, res, next) => {
  try {
    const userId = req.header('x-user-id');
    const userRole = req.header('x-user-role');
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    req.userId = userId;
    req.userRole = userRole;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication' });
  }
};

module.exports = auth;
