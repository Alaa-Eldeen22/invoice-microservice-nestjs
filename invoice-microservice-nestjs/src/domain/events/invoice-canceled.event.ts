import { DomainEvent } from './DomainEvent';

export class InvoiceCanceledEvent extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly reason: string,
    public readonly canceledAt: Date,
  ) {
    super(invoiceId);
  }
  get name(): string {
    return 'invoice.canceled';
  }
}