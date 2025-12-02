import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Economics', 'Political Science', 'Computer Science', 'Physical Education', 'Art', 'Music'];

const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sunita', 'Vikash', 'Meera', 'Suresh', 'Kavita', 'Ravi', 'Anita', 'Deepak', 'Sita', 'Manoj', 'Geeta', 'Anil', 'Rekha', 'Vinod', 'Usha', 'Ramesh', 'Lata', 'Ashok', 'Nisha', 'Sanjay', 'Pooja', 'Naresh', 'Seema', 'Mukesh', 'Asha', 'Dinesh', 'Kiran', 'Yogesh', 'Manju', 'Prakash', 'Sudha', 'Mahesh', 'Renu', 'Satish', 'Veena', 'Ajay', 'Neha', 'Pankaj', 'Shanti', 'Rohit', 'Sushma', 'Sachin', 'Vandana', 'Nitin', 'Bharti', 'Manish', 'Sarita'];

const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Agarwal', 'Jain', 'Bansal', 'Mittal', 'Goel', 'Arora', 'Chopra', 'Malhotra', 'Kapoor', 'Mehta', 'Shah', 'Patel', 'Joshi', 'Saxena', 'Tiwari'];

const qualifications = ['B.Ed', 'M.Ed', 'B.A', 'M.A', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'B.Tech', 'M.Tech'];
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhone() {
  return '9' + Math.floor(Math.random() * 900000000 + 100000000);
}

function generateEmployeeId(index) {
  return 'T' + (1000 + index).toString();
}

function generateEmail(name) {
  return name.toLowerCase().replace(' ', '.') + '@teacher.edu';
}

function generateDateOfBirth() {
  const currentYear = new Date().getFullYear();
  const age = Math.floor(Math.random() * 20) + 25; // Age between 25-45
  const birthYear = currentYear - age;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  return new Date(birthYear, month - 1, day);
}

async function seedTeachers() {
  try {
    console.log('Starting to seed 50 teachers...');

    const hashedPassword = await bcrypt.hash('teacher123', 10);

    for (let i = 0; i < 50; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const fullName = `${firstName} ${lastName}`;
      const subject = getRandomItem(subjects);

      const teacherData = {
        email: generateEmail(fullName) + i,
        password: hashedPassword,
        name: fullName,
        employeeId: generateEmployeeId(i + 1),
        subject: subject,
        qualification: getRandomItem(qualifications),
        experience: Math.floor(Math.random() * 15) + 1,
        dateOfBirth: generateDateOfBirth(),
        gender: Math.random() > 0.6 ? 'Male' : 'Female',
        address: `${Math.floor(Math.random() * 999) + 1}, ${getRandomItem(['MG Road', 'Park Street', 'Mall Road', 'Civil Lines', 'Model Town', 'Sector 15'])}, New Delhi`,
        phone: generatePhone(),
        alternatePhone: generatePhone(),
        emergencyContact: generatePhone(),
        nationality: 'Indian',
        religion: getRandomItem(religions),
        category: getRandomItem(categories),
        maritalStatus: Math.random() > 0.3 ? 'Married' : 'Single',
        bloodGroup: getRandomItem(bloodGroups),
        aadharNumber: (Math.floor(Math.random() * 900000000000) + 100000000000).toString(),
        panNumber: 'ABCDE' + Math.floor(Math.random() * 9000) + 1000 + 'F',
        bankAccount: (Math.floor(Math.random() * 9000000000000000) + 1000000000000000).toString(),
        ifscCode: 'SBIN000' + Math.floor(Math.random() * 900) + 100,
        salary: 50000,
        joiningDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      };

      try {
        await prisma.teacher.create({ data: teacherData });
        console.log(`✓ Created teacher ${i + 1}: ${fullName} (${subject})`);
      } catch (error) {
        console.error(`Error creating teacher ${i + 1}:`, error.message);
      }
    }

    console.log('✅ Successfully seeded 50 teachers!');
  } catch (error) {
    console.error('Error seeding teachers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTeachers();