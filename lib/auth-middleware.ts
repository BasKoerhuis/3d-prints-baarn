import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function verifyAdminAccess(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('admin_token')?.value;
  
  if (!token) {
    return false;
  }
  
  const payload = await verifyToken(token);
  return payload !== null;
}

export async function requireAdmin(request: NextRequest) {
  const isAdmin = await verifyAdminAccess(request);
  
  if (!isAdmin) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return null;
}
