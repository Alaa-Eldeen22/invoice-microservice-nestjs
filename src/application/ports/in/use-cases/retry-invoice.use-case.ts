import { Invoice } from 'src/domain/entities/Invoice';

export abstract class RetryInvoiceUseCase {
  abstract retry(invoiceId: string, paymentMethodId: string): Promise<Invoice>;
}