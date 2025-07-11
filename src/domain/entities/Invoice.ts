import { InvoiceItem } from './InvoiceItem';
import { Money } from '../value-objects/Money';
import { DueDate } from '../value-objects/DueDate';
import { InvoiceStatus } from '../enums/InvoiceStatus';
import { DomainEvent } from '../events/DomainEvent';
import { InvoiceCreatedEvent } from '../events/InvoiceCreatedEvent';
import { InvoicePaidEvent } from '../events/InvoicePaidEvent';
import { InvoiceFailedEvent } from '../events/invoice-failed.event';
import { InvoiceCanceledEvent } from '../events/invoice-canceled.event';
import { InvoiceItemAddedEvent } from '../events/invoice-item-added.event';
export class Invoice {
  private _id: string;
  private _clientId: string;
  private _items: InvoiceItem[];
  private _total: Money;
  private _status: InvoiceStatus;
  private _dueDate: DueDate;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _paidAt?: Date;
  private _canceledAt?: Date;
  private _notes?: string;
  private domainEvents: DomainEvent[] = [];

  private constructor(
    id: string,
    clientId: string,
    items: InvoiceItem[],
    dueDate: DueDate,
    createdAt: Date,
    notes?: string,
  ) {
    this._id = id;
    this._clientId = clientId;
    this._items = items;
    this._dueDate = dueDate;
    this._total = Money.sum(items.map((item) => item.total));
    this._status = InvoiceStatus.PENDING;
    this._createdAt = createdAt;
    this._updatedAt = createdAt;
    this._notes = notes;
  }

  static create(
    id: string,
    clientId: string,
    items: InvoiceItem[],
    dueDate: DueDate,
    notes?: string,
  ): Invoice {
    if (!items.length) {
      throw new Error('Invoice must have at least one item');
    }

    const createdAt = new Date();
    const invoice = new Invoice(id, clientId, items, dueDate, createdAt, notes);

    // Emit creation event
    invoice.addDomainEvent(
      new InvoiceCreatedEvent(
        invoice._id,
        invoice._clientId,
        invoice._total,
        invoice._dueDate.value,
        invoice._items.length,
      ),
    );

    return invoice;
  }

  static reconstruct(
    id: string,
    clientId: string,
    items: InvoiceItem[],
    total: Money,
    status: InvoiceStatus,
    dueDate: DueDate,
    createdAt: Date,
    updatedAt: Date,
    paidAt?: Date,
    canceledAt?: Date,
    notes?: string,
  ): Invoice {
    const invoice = new Invoice(id, clientId, items, dueDate, createdAt, notes);

    // Set persisted state without triggering domain events
    invoice._total = total;
    invoice._status = status;
    invoice._updatedAt = updatedAt;
    invoice._paidAt = paidAt;
    invoice._canceledAt = canceledAt;

    return invoice;
  }

  get id() {
    return this._id;
  }
  get clientId() {
    return this._clientId;
  }
  get items() {
    return [...this._items];
  }
  get total() {
    return this._total;
  }
  get status() {
    return this._status;
  }
  get dueDate() {
    return this._dueDate;
  }
  get createdAt() {
    return this._createdAt;
  }
  get updatedAt() {
    return this._updatedAt;
  }
  get paidAt() {
    return this._paidAt;
  }
  get canceledAt() {
    return this._canceledAt;
  }
  get notes() {
    return this._notes;
  }

  addItem(item: InvoiceItem): void {
    this.ensureModifiable();
    this._items.push(item);
    this._total = this._total.add(item.total);
    this.touch();
    this.addDomainEvent(
      new InvoiceItemAddedEvent(this._id, item, new Date(), this._clientId),
    );
  }

  removeItem(index: number): void {
    this.ensureModifiable();
    if (index < 0 || index >= this._items.length)
      throw new Error('Invalid item index');
    const removed = this._items.splice(index, 1)[0];
    this._total = this._total.subtract(removed.total);
    this.touch();
  }

  updateDueDate(newDate: DueDate): void {
    this.ensureModifiable();
    this._dueDate = newDate;
    this.touch();
  }

  updateNotes(notes: string): void {
    this._notes = notes;
    this.touch();
  }

  markAsPaid(date: Date = new Date()): void {
    if (
      this._status !== InvoiceStatus.PENDING &&
      this._status !== InvoiceStatus.LATE
    ) {
      throw new Error('Only pending or late invoices can be paid');
    }
    this._status = InvoiceStatus.PAID;
    this._paidAt = date;
    this.touch();

    this.addDomainEvent(
      new InvoicePaidEvent(this._id, this._clientId, this._total, this._paidAt),
    );
  }

  cancel(reason: string): void {
    if (this._status === InvoiceStatus.PAID) {
      throw new Error('Cannot cancel a paid invoice');
    }
    if (this._status === InvoiceStatus.CANCELED) return;

    this._status = InvoiceStatus.CANCELED;
    this._canceledAt = new Date();
    this.touch();
    this.addDomainEvent(
      new InvoiceCanceledEvent(this._id, reason, this._canceledAt),
    );
  }

  applyLateFee(fee: InvoiceItem): void {
    if (this._status !== InvoiceStatus.PENDING) return;
    this._items.push(fee);
    this._total = this._total.add(fee.total);
    this._status = InvoiceStatus.LATE;
    this.touch();
    // Emit domain event: LateFeeApplied
  }

  isOverdue(now: Date = new Date()): boolean {
    return (
      (this._status === InvoiceStatus.PENDING ||
        this._status === InvoiceStatus.LATE) &&
      this._dueDate.value.getTime() < now.getTime()
    );
  }

  getDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];

    this.clearDomainEvents();
    return events;
  }

  private clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  private ensureModifiable() {
    if (this._status !== InvoiceStatus.PENDING) {
      throw new Error(
        'Cannot modify invoice in current state: ' + this._status,
      );
    }
  }

  private touch() {
    this._updatedAt = new Date();
  }

  markAsFailed(reason: string, failedAt: Date = new Date()): void {
    if (
      this._status === InvoiceStatus.PAID ||
      this._status === InvoiceStatus.CANCELED ||
      this._status === InvoiceStatus.FAILED
    ) {
      throw new Error(
        'Cannot mark invoice as failed in current state: ' + this._status,
      );
    }
    this._status = InvoiceStatus.FAILED;
    this.touch();
    this.addDomainEvent(new InvoiceFailedEvent(this._id, reason, failedAt));
  }
}
