import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { orderEmail, smtpHost, smtpPort, smtpUser, smtpPass } = await request.json();

    // Validate inputs
    if (!orderEmail || !smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      return NextResponse.json(
        { success: false, error: 'Alle velden zijn verplicht' },
        { status: 400 }
      );
    }

    // Update .env file
    const envPath = join(process.cwd(), '.env');
    let envContent = readFileSync(envPath, 'utf-8');

    // Update each setting
    envContent = envContent.replace(/ORDER_EMAIL=.*/, `ORDER_EMAIL=${orderEmail}`);
    envContent = envContent.replace(/SMTP_HOST=.*/, `SMTP_HOST=${smtpHost}`);
    envContent = envContent.replace(/SMTP_PORT=.*/, `SMTP_PORT=${smtpPort}`);
    envContent = envContent.replace(/SMTP_USER=.*/, `SMTP_USER=${smtpUser}`);
    envContent = envContent.replace(/SMTP_PASS=.*/, `SMTP_PASS=${smtpPass}`);

    writeFileSync(envPath, envContent);

    return NextResponse.json({
      success: true,
      message: 'Email instellingen succesvol opgeslagen. Herstart de server om de wijziging toe te passen.'
    });
  } catch (error) {
    console.error('Email settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Er ging iets mis bij het opslaan van de email instellingen' },
      { status: 500 }
    );
  }
}