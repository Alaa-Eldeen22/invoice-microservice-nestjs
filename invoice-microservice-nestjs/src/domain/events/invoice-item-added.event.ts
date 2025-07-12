import { DomainEvent } from './DomainEvent';
import { InvoiceItem } from '../entities/InvoiceItem';

export class InvoiceItemAddedEvent extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly item: InvoiceItem,
    public readonly addedAt: Date = new Date(),
    public readonly clientId?: string,
  ) {
    super(invoiceId);
  }
  get name(): string {
    return 'invoice.item_added';
  }
}
