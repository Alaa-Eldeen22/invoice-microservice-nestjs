import { DomainEvent } from './DomainEvent';

export class InvoiceFailedEvent extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly reason: string,
    public readonly failedAt: Date,
  ) {
    super(invoiceId);
  }
  get name(): string {
    return 'invoice.failed';
  }
}