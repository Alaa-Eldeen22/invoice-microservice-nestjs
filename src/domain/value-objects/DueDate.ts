export class DueDate {
  constructor(public readonly value: Date) {
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new Error('DueDate must be a valid Date instance');
    }
    const now = new Date();
    // Clear time portion for comparison if needed
    if (value.getTime() < now.getTime()) {
      throw new Error('DueDate cannot be in the past');
    }
  }

  /**
   * Returns true if this due date is before the provided date
   */
  isBefore(date: Date): boolean {
    return this.value.getTime() < date.getTime();
  }
}
