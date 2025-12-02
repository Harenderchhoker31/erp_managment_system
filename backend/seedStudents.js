import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Rishabh', 'Aryan', 'Kabir', 'Ansh', 'Kiaan', 'Rudra', 'Prisha', 'Ananya', 'Fatima', 'Aanya', 'Diya', 'Pihu', 'Saanvi', 'Arya', 'Sara', 'Myra', 'Anika', 'Navya', 'Kavya', 'Avni', 'Aadhya', 'Shanaya', 'Akshara', 'Vanya', 'Kiara', 'Riya'];

const lastNames = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Agarwal', 'Jain', 'Bansal', 'Mittal', 'Goel', 'Arora', 'Chopra', 'Malhotra', 'Kapoor', 'Mehta', 'Shah', 'Patel', 'Joshi', 'Saxena', 'Tiwari'];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];

// Get existing classes from database
async function getExistingClasses() {
  const classes = await prisma.class.findMany({
    select: { name: true, section: true }
  });
  
  // Group by class name
  const classMap = {};
  classes.forEach(cls => {
    if (!classMap[cls.name]) {
      classMap[cls.name] = [];
    }
    if (!classMap[cls.name].includes(cls.section)) {
      classMap[cls.name].push(cls.section);
    }
  });
  
  return Object.entries(classMap).map(([name, sections]) => ({ name, sections }));
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePhone() {
  return '9' + Math.floor(Math.random() * 900000000 + 100000000);
}

function generateEmail(name) {
  return name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 1000) + '@student.edu';
}

function generateParentEmail(name) {
  return name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 1000) + '@parent.com';
}

function generateDateOfBirth(className) {
  const currentYear = new Date().getFullYear();
  let age;
  
  if (className === 'Pre-Nursery') age = 3;
  else if (className === 'Nursery') age = 4;
  else if (className === '1') age = 6;
  else if (className === '2') age = 7;
  else if (className === '3') age = 8;
  else if (className === '4') age = 9;
  else if (className === '5') age = 10;
  else if (className === '6') age = 11;
  else if (className === '7') age = 12;
  else if (className === '8') age = 13;
  else if (className === '9') age = 14;
  else if (className === '10') age = 15;
  else if (className === '11') age = 16;
  else if (className === '12') age = 17;
  
  const birthYear = currentYear - age;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 28) + 1;
  
  return new Date(birthYear, month - 1, day);
}

async function seedStudents() {
  try {
    console.log('Starting to seed students...');
    
    // Get existing classes from database
    const existingClasses = await getExistingClasses();
    console.log('Found existing classes:', existingClasses);
    
    for (const classInfo of existingClasses) {
      for (const section of classInfo.sections) {
        console.log(`Creating students for Class ${classInfo.name} - Section ${section}`);
        
        // Check current student count in this class-section
        const existingCount = await prisma.student.count({
          where: {
            class: classInfo.name,
            section: section
          }
        });
        
        const studentsToAdd = Math.max(0, 50 - existingCount);
        
        if (studentsToAdd === 0) {
          console.log(`Class ${classInfo.name}-${section} already has 50+ students, skipping...`);
          continue;
        }
        
        console.log(`Adding ${studentsToAdd} students to Class ${classInfo.name}-${section} (current: ${existingCount})`);
        
        // Get the highest roll number for this class-section
        const lastStudent = await prisma.student.findFirst({
          where: {
            class: classInfo.name,
            section: section
          },
          orderBy: {
            rollNo: 'desc'
          }
        });
        
        let startRollNumber = 1;
        if (lastStudent) {
          const lastRollMatch = lastStudent.rollNo.match(/\d+$/);
          if (lastRollMatch) {
            startRollNumber = parseInt(lastRollMatch[0]) + 1;
          }
        }
        
        for (let i = 0; i < studentsToAdd; i++) {
          const firstName = getRandomItem(firstNames);
          const lastName = getRandomItem(lastNames);
          const fullName = `${firstName} ${lastName}`;
          const rollNo = `${classInfo.name}${section}${(startRollNumber + i).toString().padStart(3, '0')}`;
          
          const fatherName = `${getRandomItem(firstNames)} ${lastName}`;
          const motherName = `${getRandomItem(firstNames.filter(n => ['Prisha', 'Ananya', 'Fatima', 'Aanya', 'Diya', 'Pihu', 'Saanvi', 'Arya', 'Sara', 'Myra', 'Anika', 'Navya', 'Kavya', 'Avni', 'Aadhya', 'Shanaya', 'Akshara', 'Vanya', 'Kiara', 'Riya'].includes(n)))} ${lastName}`;
          
          const hashedPassword = await bcrypt.hash('student123', 10);
          
          const studentData = {
            email: generateEmail(fullName),
            password: hashedPassword,
            name: fullName,
            rollNo: rollNo,
            class: classInfo.name,
            section: section,
            dateOfBirth: generateDateOfBirth(classInfo.name),
            gender: Math.random() > 0.5 ? 'Male' : 'Female',
            address: `${Math.floor(Math.random() * 999) + 1}, ${getRandomItem(['MG Road', 'Park Street', 'Mall Road', 'Civil Lines', 'Model Town', 'Sector 15', 'Green Park', 'Lajpat Nagar'])}, New Delhi`,
            phone: generatePhone(),
            parentName: `${fatherName} / ${motherName}`,
            parentPhone: generatePhone(),
            parentEmail: generateParentEmail(fatherName),
            bloodGroup: getRandomItem(bloodGroups),
            nationality: 'Indian',
            religion: getRandomItem(religions),
            category: getRandomItem(categories),
            previousSchool: (startRollNumber + i) > 25 ? `${getRandomItem(['St. Mary', 'DAV', 'DPS', 'Kendriya Vidyalaya', 'Modern School'])} School` : 'Not Applicable',
            transportMode: getRandomItem(['School Bus', 'Private Vehicle', 'Walking', 'Public Transport']),
            fatherName: fatherName,
            motherName: motherName,
            fatherPhone: generatePhone(),
            fatherEmail: generateParentEmail(fatherName),
            motherPhone: generatePhone(),
            motherEmail: generateParentEmail(motherName),
            emergencyContact: generatePhone(),
            medicalConditions: (startRollNumber + i) % 10 === 0 ? getRandomItem(['Asthma', 'Allergies']) : 'None',
            admissionDate: new Date(2024, 3, Math.floor(Math.random() * 30) + 1)
          };
          
          try {
            await prisma.student.create({ data: studentData });
          } catch (error) {
            console.error(`Error creating student ${rollNo}:`, error.message);
          }
        }
        
        console.log(`✓ Added ${studentsToAdd} students to Class ${classInfo.name} - Section ${section}`);
        
        const finalCount = await prisma.student.count({
          where: {
            class: classInfo.name,
            section: section
          }
        });
        console.log(`  Total students now: ${finalCount}`);
      }
    }
    
    console.log('✅ Successfully seeded all students!');
  } catch (error) {
    console.error('Error seeding students:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedStudents();