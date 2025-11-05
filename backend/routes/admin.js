import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Add Student
router.post('/students', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const {
      email, password, name, rollNo, class: className, section,
      dateOfBirth, gender, address, phone, parentName, parentPhone, parentEmail, bloodGroup
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        email,
        password: hashedPassword,
        name,
        rollNo,
        class: className,
        section,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        phone,
        parentName,
        parentPhone,
        parentEmail,
        bloodGroup
      }
    });

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Teacher
router.post('/teachers', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const {
      email, password, name, employeeId, subject, qualification, experience,
      dateOfBirth, gender, address, phone, salary
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await prisma.teacher.create({
      data: {
        email,
        password: hashedPassword,
        name,
        employeeId,
        subject,
        qualification,
        experience: parseInt(experience),
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        phone,
        salary: salary ? parseFloat(salary) : null
      }
    });

    res.status(201).json({ message: 'Teacher added successfully', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get('/students', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all teachers
router.get('/teachers', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;