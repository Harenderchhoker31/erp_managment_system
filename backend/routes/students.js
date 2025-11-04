import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all students for a parent
router.get('/', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      where: { parentId: req.user.id }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;