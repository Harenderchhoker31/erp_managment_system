import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    // Create Student
    const studentPassword = await bcrypt.hash('student123', 10);
    const student = await prisma.user.create({
      data: {
        email: 'john@student.in',
        password: studentPassword,
        name: 'John Student',
        role: 'PARENT', // Using PARENT role but email determines panel
        phone: '1111111111'
      }
    });
    console.log('✓ Student created:', student.email);

    // Create Teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = await prisma.user.create({
      data: {
        email: 'mary@teachers.in',
        password: teacherPassword,
        name: 'Mary Teacher',
        role: 'TEACHER',
        phone: '2222222222'
      }
    });
    console.log('✓ Teacher created:', teacher.email);

    console.log('\\nLogin credentials:');
    console.log('Student: john@student.in / student123');
    console.log('Teacher: mary@teachers.in / teacher123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();