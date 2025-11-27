import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedClasses() {
    try {
        console.log('🌱 Seeding classes...');

        // Optional: Clear existing classes to avoid duplicates
        // await prisma.class.deleteMany({});
        // console.log('Deleted existing classes');

        const classesToCreate = [];

        // Pre-Nursery and Nursery
        classesToCreate.push({ name: 'Pre-Nursery', section: 'A' });
        classesToCreate.push({ name: 'Nursery', section: 'A' });

        // Classes I to VIII (Section A)
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
        romanNumerals.forEach(roman => {
            classesToCreate.push({ name: roman, section: 'A' });
        });

        // Classes IX and X (Sections A, B)
        ['IX', 'X'].forEach(roman => {
            ['A', 'B'].forEach(section => {
                classesToCreate.push({ name: roman, section });
            });
        });

        // Classes XI and XII (Sections Arts, Medical, Non Medical, Commerce)
        ['XI', 'XII'].forEach(roman => {
            ['Arts', 'Medical', 'Non Medical', 'Commerce'].forEach(section => {
                classesToCreate.push({ name: roman, section });
            });
        });

        console.log(`Preparing to create ${classesToCreate.length} classes...`);

        for (const cls of classesToCreate) {
            // Check if class already exists
            const existing = await prisma.class.findFirst({
                where: {
                    name: cls.name,
                    section: cls.section
                }
            });

            if (!existing) {
                await prisma.class.create({
                    data: {
                        name: cls.name,
                        section: cls.section
                    }
                });
                console.log(`Created Class: ${cls.name} - ${cls.section}`);
            } else {
                console.log(`Skipped (Already exists): ${cls.name} - ${cls.section}`);
            }
        }

        console.log('✅ Class seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding classes:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedClasses();
