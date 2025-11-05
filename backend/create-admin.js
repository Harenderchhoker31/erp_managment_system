import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createUsers() {
  try {
    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@edumate.com',
        password: adminPassword,
        name: 'Admin User',
        role: 'ADMIN',
        phone: '9999999999'
      }
    });
    console.log('✓ Admin created:', admin.email);

    // Create Teacher
    const teacherPassword = await bcrypt.hash('teacher123', 10);
    const teacher = await prisma.user.create({
      data: {
        email: 'john@teacher.edu.in',
        password: teacherPassword,
        name: 'John Teacher',
        role: 'TEACHER',
        phone: '8888888888'
      }
    });
    console.log('✓ Teacher created:', teacher.email);

    // Create Parent
    const parentPassword = await bcrypt.hash('parent123', 10);
    const parent = await prisma.user.create({
      data: {
        email: 'parent@edumate.com',
        password: parentPassword,
        name: 'Parent User',
        role: 'PARENT',
        phone: '7777777777'
      }
    });
    console.log('✓ Parent created:', parent.email);

    console.log('\nLogin credentials:');
    console.log('Admin: admin@edumate.com / admin123');
    console.log('Teacher: john@teacher.edu.in / teacher123');
    console.log('Parent: parent@edumate.com / parent123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();