import { InvoiceItem } from 'src/domain/entities/InvoiceItem';

export abstract class AddInvoiceItemUseCase {
  abstract add(invoiceId: string, item: InvoiceItem): Promise<void>;
}