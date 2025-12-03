import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEvents() {
  try {
    // Create some test events
    const events = [
      {
        title: "Annual Sports Day",
        description: "School annual sports competition with various games and activities",
        date: new Date('2024-12-25T10:00:00Z')
      },
      {
        title: "Parent-Teacher Meeting",
        description: "Monthly parent-teacher meeting to discuss student progress",
        date: new Date('2024-12-20T14:00:00Z')
      },
      {
        title: "Science Exhibition",
        description: "Students will showcase their science projects and experiments",
        date: new Date('2024-12-30T09:00:00Z')
      }
    ];

    for (const event of events) {
      await prisma.event.create({
        data: event
      });
    }

    // Create some test notices
    const notices = [
      {
        title: "Holiday Notice",
        message: "School will remain closed on December 25th for Christmas celebration",
        type: "GENERAL"
      },
      {
        title: "Exam Schedule",
        message: "Final exams will start from January 15th, 2025. Please prepare accordingly",
        type: "MARKS"
      },
      {
        title: "Attendance Reminder",
        message: "Please ensure regular attendance. Minimum 75% attendance is required",
        type: "ATTENDANCE"
      }
    ];

    for (const notice of notices) {
      await prisma.notice.create({
        data: notice
      });
    }

    console.log('Events and notices seeded successfully!');
  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents();