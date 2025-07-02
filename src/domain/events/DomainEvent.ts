export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly invoiceId: string;

  constructor(invoiceId: string) {
    this.occurredOn = new Date();
    this.invoiceId = invoiceId;
  }

  abstract get name(): string;
}
