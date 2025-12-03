import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@school.edu' }
    });
    
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      console.log('Use these credentials:');
      console.log('Email: admin@school.edu');
      console.log('Password: admin123');
      return;
    }
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@school.edu',
        password: hashedPassword,
        name: 'Admin User',
        role: 'ADMIN',
        phone: '9999999999'
      }
    });
    
    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();