import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get teacher profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const teacher = await prisma.teacher.findUnique({
            where: { id: req.user.userId },
            include: {
                teacherClasses: true
            }
        });

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        const { password, ...teacherData } = teacher;
        res.json(teacherData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get assigned classes
router.get('/classes', authenticateToken, async (req, res) => {
    try {
        const classes = await prisma.teacherClass.findMany({
            where: { teacherId: req.user.userId },
            include: {
                teacher: {
                    select: { name: true, subject: true }
                }
            }
        });

        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get students by class
router.get('/students/:className/:section', authenticateToken, async (req, res) => {
    try {
        const { className, section } = req.params;

        const students = await prisma.student.findMany({
            where: {
                class: className,
                section: section
            },
            orderBy: { rollNo: 'asc' }
        });

        // Remove passwords
        const studentsData = students.map(({ password, ...student }) => student);
        res.json(studentsData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mark attendance
router.post('/attendance', authenticateToken, async (req, res) => {
    try {
        const { attendanceRecords, date } = req.body;
        // attendanceRecords: [{ studentId, status }]

        const attendanceDate = new Date(date);

        const records = await Promise.all(
            attendanceRecords.map(record =>
                prisma.attendance.upsert({
                    where: {
                        studentId_date: {
                            studentId: record.studentId,
                            date: attendanceDate
                        }
                    },
                    update: {
                        status: record.status
                    },
                    create: {
                        studentId: record.studentId,
                        date: attendanceDate,
                        status: record.status
                    }
                })
            )
        );

        res.status(201).json({
            message: 'Attendance marked successfully',
            records
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Upload marks
router.post('/marks', authenticateToken, async (req, res) => {
    try {
        const { marksRecords } = req.body;
        // marksRecords: [{ studentId, subject, examType, marks, maxMarks, date }]

        const records = await Promise.all(
            marksRecords.map(record =>
                prisma.mark.create({
                    data: {
                        studentId: record.studentId,
                        subject: record.subject,
                        examType: record.examType,
                        marks: parseInt(record.marks),
                        maxMarks: parseInt(record.maxMarks),
                        date: new Date(record.date)
                    }
                })
            )
        );

        res.status(201).json({
            message: 'Marks uploaded successfully',
            records
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create assignment
router.post('/assignments', authenticateToken, async (req, res) => {
    try {
        const { title, description, dueDate, subject, className, section } = req.body;

        const assignment = await prisma.assignment.create({
            data: {
                title,
                description,
                dueDate: new Date(dueDate),
                subject,
                class: className,
                section,
                createdBy: req.user.userId
            }
        });

        res.status(201).json({
            message: 'Assignment created successfully',
            assignment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get assignments created by teacher
router.get('/assignments', authenticateToken, async (req, res) => {
    try {
        const assignments = await prisma.assignment.findMany({
            where: { createdBy: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create event
router.post('/events', authenticateToken, async (req, res) => {
    try {
        const { title, description, date } = req.body;

        const event = await prisma.event.create({
            data: {
                title,
                description,
                date: new Date(date),
                createdBy: req.user.userId
            }
        });

        res.status(201).json({
            message: 'Event created successfully',
            event
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get events created by teacher
router.get('/events', authenticateToken, async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: { createdBy: req.user.userId },
            orderBy: { date: 'desc' }
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get feedback from parents
router.get('/feedback', authenticateToken, async (req, res) => {
    try {
        const feedback = await prisma.feedback.findMany({
            include: {
                parent: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
