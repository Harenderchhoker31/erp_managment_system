import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('Starting to seed data...');

    // Create a test student
    const hashedPassword = await bcrypt.hash('password123', 10);
    
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

    // Create a test teacher
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

    console.log('Seed data created successfully!');
    console.log('Student:', student.name);
    console.log('Teacher:', teacher.name);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();