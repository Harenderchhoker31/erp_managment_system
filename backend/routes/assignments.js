import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get assignments for a student
router.get('/:studentId', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await prisma.student.findUnique({ where: { id: studentId } });
    
    const assignments = await prisma.assignment.findMany({
      where: {
        OR: [
          { class: student.class, section: student.section },
          { studentId }
        ]
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create assignment (Teacher only)
router.post('/', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { title, description, dueDate, subject, class: className, section } = req.body;
    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        subject,
        class: className,
        section,
        createdBy: req.user.id
      }
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;