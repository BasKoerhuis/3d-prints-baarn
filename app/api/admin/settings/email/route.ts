import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync, readFileSync, existsSync } from 'fs';
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

    const settingsPath = join(process.cwd(), 'data', 'settings.json');
    
    // Create settings object
    const settings = {
      orderEmail,
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpUser,
      smtpPass,
      updatedAt: new Date().toISOString()
    };

    // Write to file
    writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    return NextResponse.json({
      success: true,
      message: 'Email instellingen succesvol opgeslagen.'
    });
  } catch (error) {
    console.error('Email settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Er ging iets mis bij het opslaan van de email instellingen' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const settingsPath = join(process.cwd(), 'data', 'settings.json');
    
    if (!existsSync(settingsPath)) {
      // Return defaults from environment variables
      return NextResponse.json({
        success: true,
        data: {
          orderEmail: process.env.ORDER_EMAIL || '',
          smtpHost: process.env.SMTP_HOST || '',
          smtpPort: process.env.SMTP_PORT || '465',
          smtpUser: process.env.SMTP_USER || '',
          smtpPass: '' // Don't return password
        }
      });
    }

    const settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    
    // Don't return the actual password, just indicate if it's set
    return NextResponse.json({
      success: true,
      data: {
        ...settings,
        smtpPass: settings.smtpPass ? '••••••••' : ''
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { success: false, error: 'Er ging iets mis' },
      { status: 500 }
    );
  }
}