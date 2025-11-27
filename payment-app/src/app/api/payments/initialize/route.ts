import { NextRequest, NextResponse } from 'next/server';
import { PaystackService } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    // Validate request origin (optional but recommended)
    const origin = request.headers.get('origin');
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json(
        { message: 'Unauthorized origin' },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Server-side validation
    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email' },
        { status: 400 }
      );
    }

    // Initialize payment
    const paymentData = await PaystackService.initializePayment({
      amount: body.amount,
      email: body.email,
      metadata: {
        ip_address: request.ip || request.headers.get('x-forwarded-for'),
        user_agent: request.headers.get('user-agent'),
      },
    });

    return NextResponse.json(paymentData);
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}