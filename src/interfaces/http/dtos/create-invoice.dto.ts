import { InvoiceItemDto } from './invoice-item.dto';

export interface CreateInvoiceDto {
  clientId: string;
  paymentMethodId: string;
  items: InvoiceItemDto[];
  dueDate: string;
  notes?: string;
}
