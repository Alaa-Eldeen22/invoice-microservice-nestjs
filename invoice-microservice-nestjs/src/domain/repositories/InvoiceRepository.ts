import { Invoice } from '../entities/Invoice';
import { InvoiceStatus } from '../enums/InvoiceStatus';

/**
 * Abstract repository defining the contract for invoice persistence operations.
 */
export abstract class InvoiceRepository {
  /**
   * Persists an invoice to the underlying storage mechanism.
   *
   * This method should handle both creating new invoices and updating existing ones.
   * The implementation should ensure data consistency and handle any persistence-specific
   * validation or constraints.
   *
   * @param invoice - The Invoice domain object to persist
   * @throws Should throw appropriate errors if persistence fails
   */
  abstract save(invoice: Invoice): Promise<void>;

  /**
   * Retrieves a single invoice by its unique identifier.
   *
   * @param id - The unique identifier of the invoice to retrieve
   * @returns Promise resolving to the Invoice domain object if found, null otherwise
   */
  abstract findById(id: string): Promise<Invoice | null>;

  /**
   * Finds all overdue invoices as of a specific reference date.
   *
   * An invoice is considered overdue if:
   * - Its status is PENDING
   * - Its due date is before the provided reference date
   *
   * This method is typically used for generating overdue reports, sending
   * payment reminders, or applying late fees.
   *
   * @param asOf - The reference date to determine which invoices are overdue
   * @returns Promise resolving to an array of overdue Invoice domain objects
   */
  abstract findOverdue(asOf: Date): Promise<Invoice[]>;

  /**
   * Finds all invoices for a specific client filtered by status.
   *
   * This method is useful for client-specific operations such as:
   * - Displaying a client's invoice history
   * - Calculating outstanding balances
   * - Generating client-specific reports
   *
   * @param clientId - The unique identifier of the client
   * @param status - The invoice status to filter by
   * @returns Promise resolving to an array of Invoice domain objects matching the criteria
   */
  abstract findByClientAndStatus(
    clientId: string,
    status: InvoiceStatus,
  ): Promise<Invoice[]>;
}
