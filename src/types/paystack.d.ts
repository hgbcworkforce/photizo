// src/types/paystack.d.ts

// No 'export' keywords here
interface PaystackResponse {
  reference: string;
  status: string;
  transaction?: string;
  message?: string;
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  access_code?: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
  metadata?: any;
  currency?: string;
}

interface PaystackPopInstance {
  openIframe: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => PaystackPopInstance;
      buildCheckoutUrl: (options: any) => string;
    };
  }
}
