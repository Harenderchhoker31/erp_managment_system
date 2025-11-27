import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get student profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: req.user.userId }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Remove password from response
        const { password, ...studentData } = student;
        res.json(studentData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get student attendance
router.get('/attendance', authenticateToken, async (req, res) => {
    try {
        const attendance = await prisma.attendance.findMany({
            where: { studentId: req.user.userId },
            orderBy: { date: 'desc' }
        });

        // Calculate attendance percentage
        const total = attendance.length;
        const present = attendance.filter(a => a.status === 'PRESENT').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;

        res.json({
            records: attendance,
            statistics: {
                total,
                present,
                absent: attendance.filter(a => a.status === 'ABSENT').length,
                late: attendance.filter(a => a.status === 'LATE').length,
                percentage
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get student marks
router.get('/marks', authenticateToken, async (req, res) => {
    try {
        const marks = await prisma.mark.findMany({
            where: { studentId: req.user.userId },
            orderBy: { date: 'desc' }
        });

        // Group by subject
        const bySubject = marks.reduce((acc, mark) => {
            if (!acc[mark.subject]) {
                acc[mark.subject] = [];
            }
            acc[mark.subject].push(mark);
            return acc;
        }, {});

        res.json({
            marks,
            bySubject
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get student assignments
router.get('/assignments', authenticateToken, async (req, res) => {
    try {
        const student = await prisma.student.findUnique({
            where: { id: req.user.userId }
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const assignments = await prisma.assignment.findMany({
            where: {
                class: student.class,
                section: student.section
            },
            orderBy: { dueDate: 'desc' }
        });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get student fees
router.get('/fees', authenticateToken, async (req, res) => {
    try {
        const fees = await prisma.fee.findMany({
            where: { studentId: req.user.userId },
            orderBy: { dueDate: 'desc' }
        });

        const totalPending = fees
            .filter(f => f.status === 'PENDING' || f.status === 'OVERDUE')
            .reduce((sum, f) => sum + f.amount, 0);

        const totalPaid = fees
            .filter(f => f.status === 'PAID')
            .reduce((sum, f) => sum + f.amount, 0);

        res.json({
            fees,
            summary: {
                totalPending,
                totalPaid,
                pendingCount: fees.filter(f => f.status === 'PENDING' || f.status === 'OVERDUE').length
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get events
router.get('/events', authenticateToken, async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'desc' },
            take: 20
        });

        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get notifications
router.get('/notifications', authenticateToken, async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
