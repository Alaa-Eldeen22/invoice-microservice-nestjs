export abstract class MarkInvoiceAsFailedUseCase {
  abstract markAsFailed(invoiceId: string, reason?: string): Promise<void>;
}