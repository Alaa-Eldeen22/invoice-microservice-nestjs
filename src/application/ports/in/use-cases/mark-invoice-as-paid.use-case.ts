export abstract class MarkInvoiceAsPaidUseCase {
  abstract markAsPaid(invoiceId: string, paidAt: Date): Promise<void>;
}