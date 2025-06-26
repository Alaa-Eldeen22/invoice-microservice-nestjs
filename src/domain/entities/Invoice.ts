import { InvoiceItem } from './InvoiceItem';
import { Money } from '../value-objects/Money';
import { DueDate } from '../value-objects/DueDate';
import { InvoiceStatus } from '../enums/InvoiceStatus';

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

  constructor(
    id: string,
    clientId: string,
    items: InvoiceItem[],
    dueDate: DueDate,
    createdAt: Date = new Date(),
    notes?: string,
  ) {
    if (!items.length) throw new Error('Invoice must have at least one item');

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
    // Emit domain event: InvoicePaid
  }

  cancel(reason: string): void {
    if (this._status === InvoiceStatus.PAID) {
      throw new Error('Cannot cancel a paid invoice');
    }
    if (this._status === InvoiceStatus.CANCELED) return;

    this._status = InvoiceStatus.CANCELED;
    this._canceledAt = new Date();
    this.touch();
    // Emit domain event: InvoiceCanceled
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

  // ─── INTERNAL HELPERS ─────────────────────────────────
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

  // ─── SERIALIZATION ────────────────────────────────────
  toJSON() {
    return {
      id: this._id,
      clientId: this._clientId,
      items: this._items.map((i) => i.toJSON?.() ?? i),
      total: this._total.toJSON(),
      status: this._status,
      dueDate: this._dueDate.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      paidAt: this._paidAt,
      canceledAt: this._canceledAt,
      notes: this._notes,
    };
  }
}
