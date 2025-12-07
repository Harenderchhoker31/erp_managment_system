import express from 'express';
import bcrypt from 'bcryptjs';
import prisma, { connectWithRetry } from '../lib/db.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Add Student
router.post('/students', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const {
      email, password, name, rollNo, class: className, section,
      dateOfBirth, gender, address, phone, bloodGroup,
      nationality, religion, category, previousSchool, transportMode, fatherName, motherName,
      fatherPhone, fatherEmail, motherPhone, motherEmail, emergencyContact, medicalConditions
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.student.create({
      data: {
        email,
        password: hashedPassword,
        name,
        rollNo,
        class: className,
        section,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        address,
        phone,
        bloodGroup,
        nationality,
        religion,
        category,
        previousSchool,
        transportMode,
        fatherName,
        motherName,
        fatherPhone,
        fatherEmail,
        motherPhone,
        motherEmail,
        emergencyContact,
        medicalConditions
      }
    });

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Teacher
router.post('/teachers', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const {
      email, password, name, employeeId, subject, qualification, experience,
      dateOfBirth, gender, address, phone, salary, joiningDate, alternatePhone,
      emergencyContact, nationality, religion, category, maritalStatus, bloodGroup,
      aadharNumber, panNumber, bankAccount, ifscCode
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const teacher = await connectWithRetry(() => 
      prisma.teacher.create({
        data: {
          email,
          password: hashedPassword,
          name,
          employeeId,
          subject,
          qualification,
          experience: parseInt(experience),
          dateOfBirth: new Date(dateOfBirth),
          gender,
          address,
          phone,
          alternatePhone: alternatePhone || '',
          emergencyContact: emergencyContact || '',
          nationality: nationality || 'Indian',
          religion: religion || 'Hindu',
          category: category || 'General',
          maritalStatus: maritalStatus || 'Single',
          bloodGroup: bloodGroup || 'O+',
          aadharNumber: aadharNumber || '',
          panNumber: panNumber || '',
          bankAccount: bankAccount || '',
          ifscCode: ifscCode || '',
          salary: salary ? parseFloat(salary) : 0,
          joiningDate: joiningDate ? new Date(joiningDate) : new Date()
        }
      })
    );

    res.status(201).json({ message: 'Teacher added successfully', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all students
router.get('/students', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const students = await connectWithRetry(() => 
      prisma.student.findMany({
        orderBy: { createdAt: 'desc' }
      })
    );
    res.json(students);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all teachers
router.get('/teachers', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const teachers = await connectWithRetry(() => 
      prisma.teacher.findMany({
        include: {
          teacherClasses: true
        },
        orderBy: { createdAt: 'desc' }
      })
    );
    res.json(teachers);
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Assign teacher to class
router.post('/assign-class', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { teacherId, className, section, subject, isClassTeacher } = req.body;

    const assignment = await prisma.teacherClass.create({
      data: {
        teacherId,
        className,
        section,
        subject,
        isClassTeacher: isClassTeacher || false
      }
    });

    res.status(201).json({ message: 'Teacher assigned to class successfully', assignment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get teacher class assignments
router.get('/teacher-classes/:teacherId', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { teacherId } = req.params;
    const assignments = await prisma.teacherClass.findMany({
      where: { teacherId },
      include: {
        teacher: { select: { name: true, subject: true } }
      }
    });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Student
router.delete('/students/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({
      where: { id }
    });
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Teacher
router.delete('/teachers/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teacher.delete({
      where: { id }
    });
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Student
router.put('/students/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email, name, rollNo, class: className, section,
      dateOfBirth, gender, address, phone, bloodGroup,
      nationality, religion, category, previousSchool, transportMode, fatherName, motherName,
      fatherPhone, fatherEmail, motherPhone, motherEmail, emergencyContact, medicalConditions
    } = req.body;

    const student = await prisma.student.update({
      where: { id },
      data: {
        email,
        name,
        rollNo,
        class: className,
        section,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        phone,
        bloodGroup,
        nationality,
        religion,
        category,
        previousSchool,
        transportMode,
        fatherName,
        motherName,
        fatherPhone,
        fatherEmail,
        motherPhone,
        motherEmail,
        emergencyContact,
        medicalConditions
      }
    });

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Teacher
router.put('/teachers/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      email, name, employeeId, subject, qualification, experience,
      dateOfBirth, gender, address, phone, salary, joiningDate, alternatePhone,
      emergencyContact, nationality, religion, category, maritalStatus, bloodGroup,
      aadharNumber, panNumber, bankAccount, ifscCode
    } = req.body;

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        email,
        name,
        employeeId,
        subject,
        qualification,
        experience: experience ? parseInt(experience) : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        address,
        phone,
        alternatePhone,
        emergencyContact,
        nationality,
        religion,
        category,
        maritalStatus,
        bloodGroup,
        aadharNumber,
        panNumber,
        bankAccount,
        ifscCode,
        salary: salary ? parseFloat(salary) : undefined,
        joiningDate: joiningDate ? new Date(joiningDate) : undefined
      }
    });

    res.json({ message: 'Teacher updated successfully', teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const totalStudents = await connectWithRetry(() => prisma.student.count());
    const totalTeachers = await connectWithRetry(() => prisma.teacher.count());
    const totalClasses = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAttendance = await connectWithRetry(() => 
      prisma.attendance.findMany({
        where: {
          date: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    );

    const present = todayAttendance.filter(a => a.status === 'PRESENT').length;
    const absent = todayAttendance.filter(a => a.status === 'ABSENT').length;
    const leave = todayAttendance.filter(a => a.status === 'LEAVE').length;

    res.json({
      totalStudents,
      totalTeachers,
      totalClasses,
      attendance: {
        present,
        absent,
        leave,
        total: present + absent + leave
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all unique classes
router.get('/classes', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const classes = await prisma.teacherClass.findMany({
      include: {
        teacher: {
          select: { name: true, subject: true }
        }
      },
      orderBy: { className: 'asc' }
    });

    res.json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all master classes (seeded classes) with student counts and class teachers
router.get('/all-classes', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    // Fetch all classes
    const classes = await prisma.class.findMany({
      include: {
        teacher: {
          select: { name: true, employeeId: true }
        }
      }
    });

    // Fetch all students to calculate counts
    const students = await prisma.student.findMany({
      select: {
        id: true,
        class: true,
        section: true
      }
    });

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findMany({
      where: {
        date: { gte: today, lt: tomorrow }
      },
      include: {
        student: {
          select: { class: true, section: true }
        }
      }
    });

    // Fetch class teachers from TeacherClass assignments
    const classTeachers = await prisma.teacherClass.findMany({
      where: {
        isClassTeacher: true
      },
      include: {
        teacher: {
          select: { name: true, employeeId: true }
        }
      }
    });

    // Calculate student counts
    const studentCounts = students.reduce((acc, student) => {
      const key = `${student.class}-${student.section}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    // Calculate attendance counts by class
    const attendanceCounts = attendance.reduce((acc, att) => {
      const key = `${att.student.class}-${att.student.section}`;
      if (!acc[key]) acc[key] = { present: 0, absent: 0, leave: 0 };
      acc[key][att.status.toLowerCase()]++;
      return acc;
    }, {});

    // Map class teachers
    const classTeacherMap = classTeachers.reduce((acc, ct) => {
      const key = `${ct.className}-${ct.section}`;
      acc[key] = ct.teacher;
      return acc;
    }, {});

    // Add count, attendance, and class teacher to each class object
    const classesWithData = classes.map(cls => {
      const key = `${cls.name}-${cls.section}`;
      return {
        ...cls,
        studentCount: studentCounts[key] || 0,
        attendance: attendanceCounts[key] || { present: 0, absent: 0, leave: 0 },
        classTeacher: cls.teacher || classTeacherMap[key] || null
      };
    });

    res.json(classesWithData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get students by class and section with attendance and fee data
router.get('/students/class/:className/:section', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { className, section } = req.params;
    const { month, year } = req.query;
    const students = await prisma.student.findMany({
      where: {
        class: className,
        section: section
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Get today's attendance
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: { in: students.map(s => s.id) },
        date: { gte: today, lt: tomorrow }
      }
    });

    // Get fee status for specified or current month
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();
    
    // Create fee records for current month if they don't exist
    for (const student of students) {
      const existingFee = await prisma.fee.findFirst({
        where: {
          studentId: student.id,
          month: currentMonth,
          year: currentYear
        }
      });
      
      if (!existingFee) {
        await prisma.fee.create({
          data: {
            studentId: student.id,
            amount: 5000, // Default fee amount
            dueDate: new Date(currentYear, currentMonth - 1, 10), // 10th of current month
            description: 'Monthly Fee',
            month: currentMonth,
            year: currentYear,
            status: 'PENDING'
          }
        });
      }
    }
    
    const fees = await prisma.fee.findMany({
      where: {
        studentId: { in: students.map(s => s.id) },
        month: currentMonth,
        year: currentYear
      }
    });

    const attendanceMap = attendance.reduce((acc, att) => {
      acc[att.studentId] = att.status;
      return acc;
    }, {});

    const feeMap = fees.reduce((acc, fee) => {
      acc[fee.studentId] = fee.status;
      return acc;
    }, {});

    const studentsWithData = students.map(student => ({
      ...student,
      todayAttendance: attendanceMap[student.id] || null,
      feeStatus: feeMap[student.id] || 'PENDING'
    }));

    res.json(studentsWithData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Class
router.post('/create-class', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { name, section } = req.body;
    
    const classData = await prisma.class.create({
      data: {
        name,
        section
      }
    });
    
    res.status(201).json({ message: 'Class created successfully', class: classData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Class
router.delete('/classes/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.class.delete({
      where: { id }
    });
    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Teacher Class Assignment
router.delete('/teacher-classes/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teacherClass.delete({
      where: { id }
    });
    res.json({ message: 'Teacher assignment removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events Routes
router.post('/events', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
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

router.get('/events', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/events/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id }
    });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notices Routes
router.post('/notices', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const notice = await prisma.notice.create({
      data: {
        title,
        message,
        type: type || 'GENERAL'
      }
    });
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/notices', authenticateToken, authorizeRole(['ADMIN', 'TEACHER']), async (req, res) => {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/notices/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.notice.delete({
      where: { id }
    });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Salary Routes
router.post('/salary', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { teacherId, amount, month, year } = req.body;
    const salary = await prisma.salary.create({
      data: {
        teacherId,
        amount: parseFloat(amount),
        month,
        year
      }
    });
    res.status(201).json({ message: 'Salary record created successfully', salary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/salaries', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const salaries = await prisma.salary.findMany({
      include: {
        teacher: {
          select: { name: true, employeeId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/salaries/teacher/:teacherId', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { teacherId } = req.params;
    const salaries = await prisma.salary.findMany({
      where: { teacherId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/salary/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidDate } = req.body;
    const salary = await prisma.salary.update({
      where: { id },
      data: {
        status,
        paidDate: paidDate ? new Date(paidDate) : null
      }
    });
    res.json({ message: 'Salary updated successfully', salary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/salary/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.salary.delete({
      where: { id }
    });
    res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug fee data
router.get('/debug-fees', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const allFees = await prisma.fee.findMany({
      include: {
        student: {
          select: { name: true, rollNo: true }
        }
      }
    });
    
    const currentMonthFees = await prisma.fee.findMany({
      where: {
        month: currentMonth,
        year: currentYear
      },
      include: {
        student: {
          select: { name: true, rollNo: true }
        }
      }
    });
    
    res.json({
      currentMonth,
      currentYear,
      totalFees: allFees.length,
      currentMonthFees: currentMonthFees.length,
      allFees: allFees.slice(0, 5),
      currentMonthFees
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance by date
router.get('/attendance/:date', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { date } = req.params;
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const students = await prisma.student.findMany({
      select: {
        id: true,
        name: true,
        rollNo: true,
        class: true,
        section: true
      },
      orderBy: { rollNo: 'asc' }
    });

    const attendance = await prisma.attendance.findMany({
      where: {
        date: {
          gte: selectedDate,
          lt: nextDay
        }
      },
      include: {
        student: {
          select: {
            name: true,
            rollNo: true
          }
        }
      }
    });

    const attendanceMap = attendance.reduce((acc, att) => {
      acc[att.studentId] = att.status;
      return acc;
    }, {});

    const studentsWithAttendance = students.map(student => ({
      ...student,
      attendance: attendanceMap[student.id] || null
    }));

    res.json(studentsWithAttendance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fee Routes
router.post('/fees', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { studentId, amount, dueDate, description, month, year, paymentMethod } = req.body;
    const fee = await prisma.fee.create({
      data: {
        studentId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description: description || 'Monthly Fee',
        month: month || new Date().getMonth() + 1,
        year: year || new Date().getFullYear(),
        paymentMethod
      }
    });
    res.status(201).json({ message: 'Fee record created successfully', fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/fees', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const fees = await prisma.fee.findMany({
      include: {
        student: {
          select: { name: true, rollNo: true, fatherPhone: true, motherPhone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/fees/:id', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paidDate, paymentMethod } = req.body;
    const fee = await prisma.fee.update({
      where: { id },
      data: {
        status,
        paidDate: paidDate ? new Date(paidDate) : null,
        paymentMethod
      }
    });
    res.json({ message: 'Fee updated successfully', fee });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/unpaid-fees-count', authenticateToken, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    
    const students = await prisma.student.findMany({
      select: { id: true, class: true, section: true }
    });
    
    const paidFees = await prisma.fee.findMany({
      where: {
        month: currentMonth,
        year: currentYear,
        status: 'PAID'
      },
      select: { studentId: true }
    });
    
    const paidStudentIds = new Set(paidFees.map(f => f.studentId));
    
    const unpaidCounts = students.reduce((acc, student) => {
      if (!paidStudentIds.has(student.id)) {
        const key = `${student.class}-${student.section}`;
        acc[key] = (acc[key] || 0) + 1;
      }
      return acc;
    }, {});
    
    res.json(unpaidCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;