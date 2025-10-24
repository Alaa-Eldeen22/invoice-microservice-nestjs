export abstract class MarkInvoiceAsAuthorizedUseCase {
  abstract markAsAuthorized(
    invoiceId: string,
    authorizedAt: Date,
  ): Promise<void>;
}
