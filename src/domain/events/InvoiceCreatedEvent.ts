import { Money } from "../value-objects/Money";
import { DomainEvent } from "./DomainEvent";

export class InvoiceCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly clientId: string,
    public readonly total: Money,
    public readonly dueDate: Date,
    public readonly itemCount: number
  ) {
    super(aggregateId);
  }

  get name(): string {
    return 'InvoiceCreated';
  }
}
