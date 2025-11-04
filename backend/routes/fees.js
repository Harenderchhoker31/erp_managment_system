import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get fees for a student
router.get('/:studentId', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const { studentId } = req.params;
    const fees = await prisma.fee.findMany({
      where: { studentId },
      orderBy: { dueDate: 'desc' }
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pay fee
router.post('/pay', authenticateToken, authorizeRole(['PARENT']), async (req, res) => {
  try {
    const { feeId } = req.body;
    const fee = await prisma.fee.update({
      where: { id: feeId },
      data: { status: 'PAID', paidDate: new Date() }
    });
    res.json({ message: 'Fee paid successfully', fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;