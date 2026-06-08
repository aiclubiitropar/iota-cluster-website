import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('iota2026', 10);
  
  const user = await prisma.teamMember.upsert({
    where: { email: '2024meb1337@iitrpr.ac.in' },
    update: {},
    create: {
      name: 'Dedeep Vasireddy',
      email: '2024meb1337@iitrpr.ac.in',
      position: 'Secretary',
      password: hashedPassword,
    }
  });
  
  console.log('Successfully created initial admin user:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
