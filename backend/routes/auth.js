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
    console.log('🔐 Login attempt:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Check User table first
    let user = await connectWithRetry(() => 
      prisma.user.findUnique({ where: { email } })
    );
    console.log('👤 User found in User table:', user ? 'Yes' : 'No');

    let userType = 'USER';
    let userRole = user?.role;

    // If not found in User table, check Student table
    if (!user) {
      const student = await connectWithRetry(() => 
        prisma.student.findUnique({ where: { email } })
      );
      console.log('🎓 Student found:', student ? 'Yes' : 'No');
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
      console.log('👨‍🏫 Teacher found:', teacher ? 'Yes' : 'No');
      if (teacher) {
        user = teacher;
        userType = 'TEACHER';
        userRole = 'TEACHER';
      }
    }

    if (!user) {
      console.log('❌ No user found with email:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    console.log('🔍 Found user:', { email: user.email, role: userRole, type: userType });
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('🔑 Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: userRole, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Login successful for:', email);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name, role: userRole }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;