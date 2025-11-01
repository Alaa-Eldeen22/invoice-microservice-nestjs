export abstract class CaptureInvoiceUseCase {
  abstract capture(invoiceId: string, paidAt: Date): Promise<void>;
}
