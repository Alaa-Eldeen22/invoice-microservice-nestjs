import { DomainEvent } from './DomainEvent';

export class InvoiceRetriedEvent extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly currency: string,
  ) {
    super(invoiceId);
  }

  get name(): string {
    return 'invoice.retried';
  }
}
