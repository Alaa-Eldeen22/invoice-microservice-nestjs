import { Injectable } from '@nestjs/common';
import { Invoice } from '../../domain/entities/Invoice';
import { InvoiceItem } from '../../domain/entities/InvoiceItem';
import { DueDate } from '../../domain/value-objects/DueDate';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/event-bus.port';
import { IdGenerator } from '../ports/id-generator.port';

@Injectable()
export class CreateInvoiceUseCase {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
    private readonly idGenerator: IdGenerator,
  ) {}

  /**
   * Handles creation of a new Invoice aggregate
   */
  async execute(input: {
    clientId: string;
    items: InvoiceItem[];
    dueDate: DueDate;
    notes?: string;
  }): Promise<Invoice> {
    const invoiceId = this.idGenerator.generate();

    const invoice = Invoice.create(
      invoiceId,
      input.clientId,
      input.items,
      input.dueDate,
      input.notes,
    );

    await this.repository.save(invoice);

    const events = invoice.getDomainEvents();
    await this.eventBus.publish(events);

    return invoice;
  }
}
