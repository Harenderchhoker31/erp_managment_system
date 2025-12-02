import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma, { connectWithRetry } from '../lib/db.js';

const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request received:', req.body);
    const { email, password, name, role, phone } = req.body;

    const existingUser = await connectWithRetry(() => 
      prisma.user.findUnique({ where: { email } })
    );

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await connectWithRetry(() => 
      prisma.user.create({
        data: { email, password: hashedPassword, name, role, phone }
      })
    );

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check User table first
    let user = await connectWithRetry(() => 
      prisma.user.findUnique({ where: { email } })
    );

    let userType = 'USER';
    let userRole = user?.role;

    // If not found in User table, check Student table
    if (!user) {
      const student = await connectWithRetry(() => 
        prisma.student.findUnique({ where: { email } })
      );
      if (student) {
        user = student;
        userType = 'STUDENT';
        userRole = 'STUDENT';
      }
    }

    // If not found in Student table, check Teacher table
    if (!user) {
      const teacher = await connectWithRetry(() => 
        prisma.teacher.findUnique({ where: { email } })
      );
      if (teacher) {
        user = teacher;
        userType = 'TEACHER';
        userRole = 'TEACHER';
      }
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: userRole, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: userRole }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;