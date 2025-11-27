import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
    try {
        console.log('🔄 Resetting admin user...\n');

        // Delete existing admin user(s)
        const deletedAdmins = await prisma.user.deleteMany({
            where: {
                role: 'ADMIN'
            }
        });

        console.log(`✅ Deleted ${deletedAdmins.count} existing admin user(s)\n`);

        // Create new admin user
        const hashedPassword = await bcrypt.hash('Admin@123', 10);

        const admin = await prisma.user.create({
            data: {
                email: 'admin@edumate.com',
                password: hashedPassword,
                role: 'ADMIN',
                name: 'System Administrator',
                phone: '9876543210'
            }
        });

        console.log('✅ New admin user created successfully!\n');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: Admin@123');
        console.log('👤 Name:', admin.name);
        console.log('\n🎉 You can now login with these credentials!\n');

    } catch (error) {
        console.error('❌ Error resetting admin:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
