import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return NextResponse.json(
        { success: false, error: 'Vul alle velden in' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Ongeldig e-mailadres' },
        { status: 400 }
      );
    }

    // Capture request metadata for abuse tracking.
    // On Vercel the visitor's public IP is in x-forwarded-for (first entry).
    const forwardedFor = request.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0].trim()
      || request.headers.get('x-real-ip')
      || 'onbekend';
    const userAgent = request.headers.get('user-agent') || 'onbekend';
    const submittedAt = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });

    // Send email
    const emailSent = await sendContactEmail({ ...data, ip, userAgent, submittedAt });

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Er ging iets mis bij het versturen. Probeer het opnieuw.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bericht succesvol verzonden!'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
