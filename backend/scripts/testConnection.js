import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Check existing data
    const userCount = await prisma.user.count();
    const studentCount = await prisma.student.count();
    const teacherCount = await prisma.teacher.count();
    
    console.log(`📊 Current data:`);
    console.log(`   Users: ${userCount}`);
    console.log(`   Students: ${studentCount}`);
    console.log(`   Teachers: ${teacherCount}`);
    
    // If no data exists, create some test data
    if (userCount === 0 && studentCount === 0 && teacherCount === 0) {
      console.log('🔄 Creating test data...');
      
      const hashedPassword = await bcrypt.hash('password123', 10);
      
      // Create admin user
      const admin = await prisma.user.create({
        data: {
          email: 'admin@school.edu',
          password: hashedPassword,
          name: 'Admin User',
          role: 'ADMIN',
          phone: '9999999999'
        }
      });
      
      // Create test student
      const student = await prisma.student.create({
        data: {
          email: 'john.doe@student.edu',
          password: hashedPassword,
          name: 'John Doe',
          rollNo: 'STU001',
          class: '10',
          section: 'A',
          dateOfBirth: new Date('2008-05-15'),
          gender: 'Male',
          address: '123 Main Street, City',
          phone: '9876543210',
          fatherName: 'Robert Doe',
          motherName: 'Mary Doe',
          fatherPhone: '9876543211',
          motherPhone: '9876543212',
          fatherEmail: 'robert.doe@email.com',
          motherEmail: 'mary.doe@email.com'
        }
      });
      
      // Create test teacher
      const teacher = await prisma.teacher.create({
        data: {
          email: 'jane.smith@teacher.edu',
          password: hashedPassword,
          name: 'Jane Smith',
          employeeId: 'TCH001',
          subject: 'Mathematics',
          qualification: 'M.Sc Mathematics',
          experience: 5,
          dateOfBirth: new Date('1985-03-20'),
          gender: 'Female',
          address: '456 Teacher Lane, City',
          phone: '9876543213',
          salary: 50000,
          joiningDate: new Date('2020-06-01')
        }
      });
      
      console.log('✅ Test data created successfully!');
      console.log(`   Admin: ${admin.email}`);
      console.log(`   Student: ${student.name} (${student.email})`);
      console.log(`   Teacher: ${teacher.name} (${teacher.email})`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();