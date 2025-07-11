import { DomainEvent } from './DomainEvent';
import { InvoiceItem } from '../entities/InvoiceItem';

export class InvoiceItemRemovedEvent extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly removedAt: Date = new Date(),
    public readonly clientId?: string,
    public readonly item?: InvoiceItem,
  ) {
    super(invoiceId);
  }
  get name(): string {
    return 'invoice.item_removed';
  }
}
