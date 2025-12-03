import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDB() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]*@/, ':***@'));
    
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    const userCount = await prisma.user.count();
    console.log('✅ User count:', userCount);
    
    const studentCount = await prisma.student.count();
    console.log('✅ Student count:', studentCount);
    
    const teacherCount = await prisma.teacher.count();
    console.log('✅ Teacher count:', teacherCount);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();