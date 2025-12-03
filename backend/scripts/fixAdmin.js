import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixAdmin() {
  try {
    // Delete existing admin if exists
    await prisma.user.deleteMany({
      where: { email: 'admin@school.edu' }
    });
    
    // Create new admin with simple password
    const hashedPassword = await bcrypt.hash('admin', 10);
    
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
    console.log('Email: admin@school.edu');
    console.log('Password: admin');
    
    // Test the password
    const testPassword = await bcrypt.compare('admin', admin.password);
    console.log('Password test:', testPassword ? 'PASS' : 'FAIL');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdmin();