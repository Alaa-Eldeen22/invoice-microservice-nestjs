import { Invoice } from '../entities/Invoice';
import { InvoiceStatus } from '../enums/InvoiceStatus';

export interface InvoiceRepository {
  save(invoice: Invoice): Promise<void>;
  findById(id: string): Promise<Invoice | null>;
  findOverdue(asOf: Date): Promise<Invoice[]>;
  findByClientAndStatus(
    clientId: string,
    status: InvoiceStatus,
  ): Promise<Invoice[]>;
}
