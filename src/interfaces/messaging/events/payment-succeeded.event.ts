export interface PaymentSucceededEvent {
  invoiceId: string;
  paymentId: string;
  amount: number;
  currency: string;
  paidAt: string;
}
