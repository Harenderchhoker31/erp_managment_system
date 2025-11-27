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
      dateOfBirth, gender, address, phone, salary, joiningDate
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
        salary: salary ? parseFloat(salary) : null,
        joiningDate: joiningDate ? new Date(joiningDate) : new Date()
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
      include: {
        teacherClasses: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assign teacher to class
router.post('/assign-class', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { teacherId, className, section, subject, isClassTeacher } = req.body;

    const assignment = await prisma.teacherClass.create({
      data: {
        teacherId,
        className,
        section,
        subject,
        isClassTeacher: isClassTeacher || false
      }
    });

    res.status(201).json({ message: 'Teacher assigned to class successfully', assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teacher class assignments
router.get('/teacher-classes/:teacherId', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { teacherId } = req.params;
    const assignments = await prisma.teacherClass.findMany({
      where: { teacherId },
      include: {
        teacher: { select: { name: true, subject: true } }
      }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Student
router.delete('/students/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({
      where: { id }
    });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Teacher
router.delete('/teachers/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teacher.delete({
      where: { id }
    });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Student
router.put('/students/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email, name, rollNo, class: className, section,
      dateOfBirth, gender, address, phone, parentName, parentPhone, parentEmail, bloodGroup
    } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        email,
        name,
        rollNo,
        class: className,
        section,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        phone,
        parentName,
        parentPhone,
        parentEmail,
        bloodGroup
      }
    });

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Teacher
router.put('/teachers/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email, name, employeeId, subject, qualification, experience,
      dateOfBirth, gender, address, phone, salary, joiningDate
    } = req.body;

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        email,
        name,
        employeeId,
        subject,
        qualification,
        experience: experience ? parseInt(experience) : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        phone,
        salary: salary ? parseFloat(salary) : undefined,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined
      }
    });

    res.json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalTeachers = await prisma.teacher.count();
    const totalClasses = await prisma.teacherClass.count();

    // Get recent attendance stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: today
        }
      }
    });

    const presentToday = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absentToday = todayAttendance.filter(a => a.status === 'ABSENT').length;

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      attendance: {
        present: presentToday,
        absent: absentToday,
        total: todayAttendance.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all unique classes
router.get('/classes', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const classes = await prisma.teacherClass.findMany({
      include: {
        teacher: {
          select: { name: true, subject: true }
        }
      },
      orderBy: { className: 'asc' }
    });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;