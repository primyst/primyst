import { NextRequest, NextResponse } from 'next/server';
import { PaystackService } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { message: 'Reference is required' },
        { status: 400 }
      );
    }

    const verification = await PaystackService.verifyPayment(reference);

    if (verification.data.status !== 'success') {
      return NextResponse.json(
        { message: 'Payment failed or pending' },
        { status: 400 }
      );
    }

    // Here you should update your database with the payment status
    await updatePaymentStatus(reference, 'completed', verification.data);

    return NextResponse.json({
      status: 'success',
      data: verification.data,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Verification failed' },
      { status: 500 }
    );
  }
}

async function updatePaymentStatus(reference: string, status: string, data: any) {
  // Implement your database update logic here
  // This is where you mark the payment as completed in your database
  console.log(`Updating payment ${reference} to ${status}`, data);
}