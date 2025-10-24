export abstract class RemoveInvoiceItemUseCase {
  abstract remove(invoiceId: string, index: number): Promise<void>;
}