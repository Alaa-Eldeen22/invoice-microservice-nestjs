import { Money } from '../value-objects/Money';

export class InvoiceItem {
  constructor(
    public readonly description: string,
    public readonly quantity: number,
    public readonly unitPrice: Money,
  ) {
    // Business rule: description cannot be empty
    if (!description || !description.trim()) {
      throw new Error('InvoiceItem description is required');
    }
    // Business rule: quantity must be positive
    if (quantity <= 0) {
      throw new Error('InvoiceItem quantity must be greater than zero');
    }
    // Type check: unitPrice must be a Money value object
    if (!(unitPrice instanceof Money)) {
      throw new Error('unitPrice must be a Money instance');
    }
  }

  /**
   * Compute total price for this line item (unitPrice * quantity)
   */
  get total(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  /**
   * Serialize to JSON-friendly object
   */
  toJSON() {
    return {
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice.toJSON(),
      total: this.total.toJSON(),
    };
  }
}
