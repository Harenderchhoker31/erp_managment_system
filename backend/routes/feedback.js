import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Submit feedback
router.post('/', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const { message, rating } = req.body;
    const feedback = await prisma.feedback.create({
      data: { parentId: req.user.id, message, rating }
    });
    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;