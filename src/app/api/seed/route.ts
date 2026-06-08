import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const hashedPassword = await bcrypt.hash('iota2026', 10);
    
    const user = await prisma.teamMember.upsert({
      where: { email: '2024meb1337@iitrpr.ac.in' },
      update: {
        password: hashedPassword,
        position: 'Secretary'
      },
      create: {
        name: 'Dedeep Vasireddy',
        email: '2024meb1337@iitrpr.ac.in',
        position: 'Secretary',
        password: hashedPassword,
      }
    });
    
    return NextResponse.json({ success: true, user: user.email });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
