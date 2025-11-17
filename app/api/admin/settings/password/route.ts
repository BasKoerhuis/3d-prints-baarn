import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json();

    // Verify current password
    const currentHash = Buffer.from(
      process.env.ADMIN_PASSWORD_HASH_BASE64 || '',
      'base64'
    ).toString('utf-8');

    const isValid = await bcrypt.compare(currentPassword, currentHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Huidig wachtwoord is onjuist' },
        { status: 401 }
      );
    }

    // Generate new hash
    const newHash = await bcrypt.hash(newPassword, 10);
    const newHashBase64 = Buffer.from(newHash).toString('base64');

    // Update .env file
    const envPath = join(process.cwd(), '.env');
    let envContent = readFileSync(envPath, 'utf-8');
    
    envContent = envContent.replace(
      /ADMIN_PASSWORD_HASH_BASE64=.*/,
      `ADMIN_PASSWORD_HASH_BASE64=${newHashBase64}`
    );

    writeFileSync(envPath, envContent);

    return NextResponse.json({
      success: true,
      message: 'Wachtwoord succesvol gewijzigd. Herstart de server om de wijziging toe te passen.',
      newHash: newHashBase64
    });
  } catch (error) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: 'Er ging iets mis bij het wijzigen van het wachtwoord' },
      { status: 500 }
    );
  }
}