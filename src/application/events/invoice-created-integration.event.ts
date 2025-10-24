import { InvoiceCreatedEvent } from 'src/domain/events/invoice-created.event';

export class InvoiceCreatedIntegrationEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly dueDate: Date,
    public readonly itemCount: number,
    public readonly paymentMethodId: string,
  ) {}

  get name(): string {
    return 'invoice.created';
  }

  public static fromDomainEvent(
    event: InvoiceCreatedEvent,
    paymentMethodId: string,
  ) {
    return new InvoiceCreatedIntegrationEvent(
      event.invoiceId,
      event.clientId,
      event.amount,
      event.currency,
      event.dueDate,
      event.itemCount,
      paymentMethodId,
    );
  }
}
