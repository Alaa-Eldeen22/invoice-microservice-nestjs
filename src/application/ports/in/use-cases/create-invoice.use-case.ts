import { Invoice } from 'src/domain/entities/Invoice';
import { InvoiceItem } from 'src/domain/entities/InvoiceItem';
import { DueDate } from 'src/domain/value-objects/DueDate';

export abstract class CreateInvoiceUseCase {
  abstract create(input: {
    clientId: string;
    items: InvoiceItem[];
    dueDate: DueDate;
    notes?: string;
    paymentMethodId: string;
  }): Promise<Invoice>;
}