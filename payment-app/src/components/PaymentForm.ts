'use client';

import { useState } from 'react';

interface PaymentFormProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onError: (error: string) => void;
}

export default function PaymentForm({ amount, email, onSuccess, onError }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initializePayment = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }

      if (data.data.authorization_url) {
        // Redirect to Paystack
        window.location.href = data.data.authorization_url;
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
      <div className="mb-4">
        <p className="text-gray-600">Amount: ₦{(amount / 100).toLocaleString()}</p>
        <p className="text-gray-600">Email: {email}</p>
      </div>
      <button
        onClick={initializePayment}
        disabled={isLoading}
        className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}