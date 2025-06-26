// src/domain/value-objects/Money.ts

export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    if (amount < 0) {
      throw new Error('Money amount must be non-negative');
    }
    if (!currency || !currency.trim()) {
      throw new Error('Currency must be a non-empty string');
    }
  }

  /**
   * Factory method for creating Money instances
   */
  static of(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  /**
   * Adds two Money values. Currencies must match.
   */
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtracts another Money from this. Result must be non-negative.
   */
  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Resulting Money amount cannot be negative');
    }
    return new Money(result, this.currency);
  }

  /**
   * Multiplies this Money by a non-negative factor.
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Multiplication factor must be non-negative');
    }
    return new Money(this.amount * factor, this.currency);
  }

  /**
   * Checks equality by value (amount and currency).
   */
  equals(other: Money): boolean {
    return this.currency === other.currency && this.amount === other.amount;
  }

  /**
   * Ensures two Money instances share the same currency.
   */
  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(
        `Currency mismatch: ${this.currency} vs ${other.currency}`,
      );
    }
  }

  /**
   * Sums an array of Money instances. Requires at least one element.
   */
  static sum(list: Money[]): Money {
    if (list.length === 0) {
      throw new Error('Cannot sum an empty Money list');
    }
    return list.reduce((acc, m) => acc.add(m));
  }

  /**
   * Serialize to a JSON-friendly representation.
   */
  toJSON() {
    return {
      amount: this.amount,
      currency: this.currency,
    };
  }
}
