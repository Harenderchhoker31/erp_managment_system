import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get marks for a student
router.get('/:studentId', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const marks = await prisma.mark.findMany({
      where: { studentId },
      orderBy: { date: 'desc' }
    });
    res.json(marks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload marks (Teacher only)
router.post('/', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { studentId, subject, examType, marks, maxMarks, date } = req.body;
    const mark = await prisma.mark.create({
      data: { studentId, subject, examType, marks, maxMarks, date: new Date(date) }
    });
    res.status(201).json(mark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;