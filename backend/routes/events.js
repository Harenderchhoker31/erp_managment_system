import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all events
router.get('/', authenticateToken, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: { creator: { select: { name: true } } }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event (Teacher only)
router.post('/', authenticateToken, authorizeRole(['TEACHER']), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const event = await prisma.event.create({
      data: { title, description, date: new Date(date), createdBy: req.user.id }
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;