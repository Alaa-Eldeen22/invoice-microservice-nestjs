import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';

import { InvoiceRepository } from '../../../domain/repositories/InvoiceRepository';
import { Invoice } from '../../../domain/entities/Invoice';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceStatus } from '../../../domain/enums/InvoiceStatus';
import { InvoiceMapper } from '../mappers/invoice.mapper';

/**
 * TypeORM implementation of the InvoiceRepository interface.
 * Handles persistence and retrieval of Invoice domain objects using TypeORM entities.
 */
@Injectable()
export class TypeormInvoiceRepository implements InvoiceRepository {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}

  /**
   * Persists an invoice domain object to the database.
   * @param invoice - The Invoice domain object to save
   */
  async save(invoice: Invoice): Promise<void> {
    const invoiceEntity = InvoiceMapper.toEntity(invoice);
    await this.invoiceRepository.save(invoiceEntity);
  }

  /**
   * Finds a single invoice by its unique identifier.
   * @param invoiceId - The unique identifier of the invoice
   * @returns Promise resolving to an Invoice domain object or null if not found
   */
  async findById(invoiceId: string): Promise<Invoice | null> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return null;
    }

    return InvoiceMapper.toDomain(invoice);
  }

  /**
   * Finds all invoices for a specific client with a given status.
   * @param clientId - The unique identifier of the client
   * @param invoiceStatus - The status to filter invoices by
   * @returns Promise resolving to an array of Invoice domain objects
   */
  async findByClientAndStatus(
    clientId: string,
    invoiceStatus: InvoiceStatus,
  ): Promise<Invoice[]> {
    const foundInvoiceEntities = await this.invoiceRepository.find({
      where: {
        clientId,
        status: invoiceStatus,
      },
    });

    return foundInvoiceEntities.map((invoiceEntity) =>
      InvoiceMapper.toDomain(invoiceEntity),
    );
  }

  /**
   * Finds all overdue invoices based on a reference date.
   * An invoice is considered overdue if it's pending and its due date is before the check date.
   * @param referenceDate - The date to compare against invoice due dates
   * @returns Promise resolving to an array of overdue Invoice domain objects
   */
  async findOverdue(referenceDate: Date): Promise<Invoice[]> {
    const overdueInvoiceEntities = await this.invoiceRepository.find({
      where: {
        status: InvoiceStatus.PENDING,
        dueDate: LessThan(referenceDate),
      },
    });

    return overdueInvoiceEntities.map((invoiceEntity) =>
      InvoiceMapper.toDomain(invoiceEntity),
    );
  }
}
