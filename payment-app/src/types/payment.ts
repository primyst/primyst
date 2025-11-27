export interface PaymentIntent {
  amount: number;
  email: string;
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface WebhookEvent {
  event: string;
  data: {
    reference: string;
    status: 'success' | 'failed';
    amount: number;
    customer: {
      email: string;
    };
    metadata?: Record<string, any>;
  };
}