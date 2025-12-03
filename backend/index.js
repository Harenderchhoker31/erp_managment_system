import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Import routes
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Database connection will be handled automatically by Prisma

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);


// Health check
app.get('/', async (req, res) => {
  try {
    // Test database connection with MongoDB
    await prisma.user.count();
    res.json({ 
      message: 'EduMate API is running!',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'EduMate API is running but database connection failed',
      database: 'Disconnected',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint
app.get('/debug', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();
    
    const students = await prisma.student.findMany({ take: 3 });
    const teachers = await prisma.teacher.findMany({ take: 3 });
    
    res.json({
      counts: { users: userCount, students: studentCount, teachers: teacherCount },
      sampleData: { students, teachers },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoints without auth
app.get('/test/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany({ take: 10 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/test/teachers', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({ take: 10 });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/test/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔍 Test login attempt for:', email);
    
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(400).json({ error: 'User not found' });
    }
    
    console.log('🔑 Comparing passwords...');
    const isValid = await bcrypt.compare(password, user.password);
    console.log('✅ Password valid:', isValid);
    
    if (!isValid) {
      console.log('❌ Invalid password');
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    console.log('🎉 Login successful!');
    res.json({ 
      message: 'Login successful', 
      user: { email: user.email, role: user.role, name: user.name }
    });
  } catch (error) {
    console.error('💥 Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({ 
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Test database connection
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();
    
    console.log(`📊 Database stats:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Teachers: ${teacherCount}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

// Export prisma for use in routes
export { prisma };

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
