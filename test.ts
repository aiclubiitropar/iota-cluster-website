import prisma from './src/lib/prisma';
import bcrypt from 'bcryptjs';

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
  
  console.log('Successfully created user:', user.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
