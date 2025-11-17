import { NextResponse } from 'next/server';
import { getAdminCredentials } from '@/lib/auth';

export async function GET() {
  const admin = getAdminCredentials();
  const rawHash = process.env.ADMIN_PASSWORD_HASH || '';
  
  return NextResponse.json({
    hasUsername: !!admin.username,
    username: admin.username,
    hasPasswordHash: !!admin.passwordHash,
    passwordHashLength: admin.passwordHash.length,
    passwordHashStart: admin.passwordHash.substring(0, 10) + '...',
    passwordHashEnd: '...' + admin.passwordHash.substring(admin.passwordHash.length - 10),
    rawEnvHash: rawHash,
    rawEnvHashLength: rawHash.length,
    envCheck: {
      ADMIN_USERNAME: !!process.env.ADMIN_USERNAME,
      ADMIN_PASSWORD_HASH: !!process.env.ADMIN_PASSWORD_HASH,
      JWT_SECRET: !!process.env.JWT_SECRET,
    }
  });
}