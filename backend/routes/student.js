import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get student profile
router.get('/profile', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        rollNo: true,
        class: true,
        section: true,
        fatherName: true,
        motherName: true,
        phone: true
      }
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student attendance
router.get('/attendance', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: req.user.id },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student marks
router.get('/marks', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const marks = await prisma.mark.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student assignments
router.get('/assignments', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      select: { class: true, section: true }
    });

    const assignments = await prisma.assignment.findMany({
      where: {
        class: student.class,
        section: student.section
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student fees
router.get('/fees', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      where: { studentId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get events
router.get('/events', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: { name: true, role: true }
        }
      },
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notices
router.get('/notices', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    const noticesWithCreator = await Promise.all(notices.map(async (notice) => {
      if (notice.createdBy) {
        let creator = await prisma.user.findUnique({
          where: { id: notice.createdBy },
          select: { name: true, role: true }
        });
        
        if (!creator) {
          const teacher = await prisma.teacher.findUnique({
            where: { id: notice.createdBy },
            select: { name: true }
          });
          if (teacher) {
            creator = { name: teacher.name, role: 'TEACHER' };
          }
        }
        
        return { ...notice, creator };
      }
      return notice;
    }));
    
    res.json(noticesWithCreator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teachers for feedback
router.get('/teachers', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.user.id },
      select: { class: true, section: true }
    });

    const teachers = await prisma.teacherClass.findMany({
      where: {
        className: student.class,
        section: student.section
      },
      include: {
        teacher: {
          select: { id: true, name: true, subject: true }
        }
      }
    });
    
    res.json(teachers.map(tc => tc.teacher));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send feedback to teacher
router.post('/feedback', authenticateToken, authorizeRole(['STUDENT']), async (req, res) => {
  try {
    const { teacherId, message, rating } = req.body;
    
    // Create feedback with student as parent (since students are sending feedback)
    const feedback = await prisma.feedback.create({
      data: {
        parentId: req.user.id,
        message,
        rating: rating ? parseInt(rating) : null,
        teacherId
      }
    });

    res.status(201).json({ message: 'Feedback sent successfully', feedback });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;