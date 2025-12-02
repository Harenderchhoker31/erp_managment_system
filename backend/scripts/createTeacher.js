import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTeacher() {
    try {
        console.log('🔄 Creating teacher user...\n');

        const hashedPassword = await bcrypt.hash('teacher123', 10);

        const teacher = await prisma.user.create({
            data: {
                email: 'teacher@edumate.com',
                password: hashedPassword,
                role: 'TEACHER',
                name: 'John Smith',
                phone: '9876543210'
            }
        });

        console.log('✅ Teacher user created successfully!\n');
        console.log('📧 Email:', teacher.email);
        console.log('🔑 Password: teacher123');
        console.log('👤 Name:', teacher.name);
        console.log('\n🎉 You can now login as a teacher!\n');

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️  Teacher user already exists!');
        } else {
            console.error('❌ Error creating teacher:', error.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createTeacher();