import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminLogin, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Gebruikersnaam en wachtwoord zijn verplicht' },
        { status: 400 }
      );
    }

    const isValid = await verifyAdminLogin(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Ongeldige inloggegevens' },
        { status: 401 }
      );
    }

    const token = await createToken({ username });

    const response = NextResponse.json({
      success: true,
      message: 'Succesvol ingelogd'
    });

    // Set cookie with token
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
