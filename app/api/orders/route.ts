import { NextRequest, NextResponse } from 'next/server';
import { sendOrderEmail } from '@/lib/email';
import { OrderFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const data: OrderFormData = await request.json();

    // Validate required fields
    if (!data.name || !data.address || !data.city || !data.contactValue || !data.products || data.products.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vul alle verplichte velden in' },
        { status: 400 }
      );
    }

    // Send email
    const emailSent = await sendOrderEmail(data);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, error: 'Er ging iets mis bij het versturen. Probeer het opnieuw.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Bestelling succesvol verzonden!'
    });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
