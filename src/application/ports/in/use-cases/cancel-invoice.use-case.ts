export abstract class CancelInvoiceUseCase {
  abstract cancel(invoiceId: string, canceledAt: Date): Promise<void>;
}
