export abstract class CancelInvoiceUseCase {
  abstract cancel(invoiceId: string, reason?: string): Promise<void>;
}