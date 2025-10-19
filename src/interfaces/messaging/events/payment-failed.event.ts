export interface PaymentFailedEvent {
  invoiceId: string;
  reason: string;
  failedAt: string;
}
