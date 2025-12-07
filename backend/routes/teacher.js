import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get teacher profile
router.get('/profile', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        employeeId: true,
        subject: true,
        qualification: true,
        experience: true
      }
    });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teacher's assigned classes
router.get('/classes', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const classes = await prisma.teacherClass.findMany({
      where: { teacherId: req.user.id },
      include: {
        teacher: { select: { name: true, subject: true } }
      }
    });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students by class and section
router.get('/students/:className/:section', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { className, section } = req.params;
    const students = await prisma.student.findMany({
      where: {
        class: className,
        section: section
      },
      orderBy: { rollNo: 'asc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark attendance
router.post('/attendance', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { attendanceRecords, date } = req.body;
    console.log('Attendance submission:', { attendanceRecords, date, teacherId: req.user.id });
    
    if (!attendanceRecords || !Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
      return res.status(400).json({ error: 'No attendance records provided' });
    }
    
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Delete existing attendance for the same date first
    const studentIds = attendanceRecords.map(record => record.studentId);
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    await prisma.attendance.deleteMany({
      where: {
        studentId: { in: studentIds },
        date: {
          gte: attendanceDate,
          lt: nextDay
        }
      }
    });
    
    const attendanceData = attendanceRecords.map(record => ({
      studentId: record.studentId,
      status: record.status,
      date: attendanceDate
    }));

    const result = await prisma.attendance.createMany({
      data: attendanceData
    });

    console.log('Attendance created:', result);
    res.status(201).json({ message: 'Attendance marked successfully', count: result.count });
  } catch (error) {
    console.error('Attendance error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload marks
router.post('/marks', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { marksRecords } = req.body;
    
    const marksData = marksRecords.map(record => ({
      studentId: record.studentId,
      subject: record.subject,
      examType: record.examType,
      marks: parseInt(record.marks),
      maxMarks: parseInt(record.maxMarks),
      date: new Date(record.date)
    }));

    await prisma.mark.createMany({
      data: marksData
    });

    res.status(201).json({ message: 'Marks uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create assignment
router.post('/assignments', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { title, description, dueDate, className, section, subject } = req.body;
    
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        class: className,
        section,
        subject,
        createdBy: req.user.id
      }
    });

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teacher's assignments
router.get('/assignments', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { createdBy: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event
router.post('/events', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        createdBy: req.user.id
      }
    });

    res.status(201).json({ message: 'Event created successfully', event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teacher's events
router.get('/events', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { createdBy: req.user.id },
      include: {
        creator: {
          select: { name: true, role: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get feedback
router.get('/feedback', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { teacherId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    // Get sender info for each feedback
    const feedbackWithSender = await Promise.all(feedback.map(async (fb) => {
      // Try to find in User table first
      let sender = await prisma.user.findUnique({
        where: { id: fb.parentId },
        select: { name: true, email: true }
      });
      
      // If not found, try Student table
      if (!sender) {
        const student = await prisma.student.findUnique({
          where: { id: fb.parentId },
          select: { name: true, email: true }
        });
        if (student) {
          sender = { name: student.name, email: student.email };
        }
      }
      
      return { ...fb, sender };
    }));
    
    res.json(feedbackWithSender);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create notice
router.post('/notices', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { title, message, type } = req.body;
    
    // Get teacher info
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.user.id },
      select: { name: true }
    });
    
    const notice = await prisma.notice.create({
      data: {
        title,
        message,
        type: type || 'GENERAL',
        createdBy: req.user.id
      }
    });

    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notices
router.get('/notices', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Get creator info for each notice
    const noticesWithCreator = await Promise.all(notices.map(async (notice) => {
      if (notice.createdBy) {
        // Try to find in User table first (admin)
        let creator = await prisma.user.findUnique({
          where: { id: notice.createdBy },
          select: { name: true, role: true }
        });
        
        // If not found, try Teacher table
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

export default router;