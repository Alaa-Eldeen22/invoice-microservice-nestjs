import { InvoiceItemDto } from './invoice-item.dto';

export interface CreateInvoiceDto {
  clientId: string;
  items: InvoiceItemDto[];
  dueDate: string;
  notes?: string;
}
