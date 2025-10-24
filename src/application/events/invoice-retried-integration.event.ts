import { InvoiceRetriedEvent } from 'src/domain/events/invoice-retried.event';

export class InvoiceRetriedIntegrationEvent {
  constructor(
    public readonly invoiceId: string,
    public readonly clientId: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly paymentMethodId: string,
  ) {}

  get name(): string {
    return 'invoice.retried';
  }

  public static fromDomainEvent(
    event: InvoiceRetriedEvent,
    paymentMethodId: string,
  ) {
    return new InvoiceRetriedIntegrationEvent(
      event.invoiceId,
      event.clientId,
      event.amount,
      event.currency,
      paymentMethodId,
    );
  }
}
