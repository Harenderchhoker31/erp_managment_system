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

    console.log('\nLogin credentials:');
    console.log('Admin: admin@edumate.com / admin123');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUsers();