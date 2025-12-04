import jwt from 'jsonwebtoken';
import prisma, { connectWithRetry } from '../lib/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    // Check based on userType from token
    if (decoded.userType === 'TEACHER') {
      user = await connectWithRetry(() => 
        prisma.teacher.findUnique({ where: { id: decoded.userId } })
      );
    } else if (decoded.userType === 'STUDENT') {
      user = await connectWithRetry(() => 
        prisma.student.findUnique({ where: { id: decoded.userId } })
      );
    } else {
      user = await connectWithRetry(() => 
        prisma.user.findUnique({ where: { id: decoded.userId } })
      );
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = { ...user, role: decoded.role };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};