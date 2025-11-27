import axios from 'axios';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackApi = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    'Content-Type': 'application/json',
  },
});

export class PaystackService {
  static async initializePayment(paymentData: PaymentIntent) {
    try {
      const response = await paystackApi.post('/transaction/initialize', {
        email: paymentData.email,
        amount: paymentData.amount * 100, // Convert to kobo
        currency: paymentData.currency || 'NGN',
        reference: paymentData.reference || this.generateReference(),
        metadata: paymentData.metadata,
      });

      return response.data;
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw new Error('Failed to initialize payment');
    }
  }

  static async verifyPayment(reference: string) {
    try {
      const response = await paystackApi.get(`/transaction/verify/${reference}`);
      return response.data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw new Error('Failed to verify payment');
    }
  }

  static generateReference(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static validateWebhookSignature(payload: any, signature: string): boolean {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', process.env.WEBHOOK_SECRET!)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    return hash === signature;
  }
}