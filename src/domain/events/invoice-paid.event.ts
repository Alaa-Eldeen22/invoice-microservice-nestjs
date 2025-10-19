import { DomainEvent } from './DomainEvent';
import { Money } from '../value-objects/Money';

export class InvoicePaidEvent extends DomainEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly clientId: string,
    public readonly amount: Money,
    public readonly paidAt: Date,
  ) {
    super(invoiceId);
  }
  get name(): string {
    return 'invoice.paid';
  }
}
