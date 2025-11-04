import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get attendance for a student
router.get('/:studentId', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const attendance = await prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload attendance (Teacher only)
router.post('/', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { studentId, date, status } = req.body;
    const attendance = await prisma.attendance.create({
      data: { studentId, date: new Date(date), status }
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;