import { Injectable } from '@nestjs/common';
import { Invoice } from '../../domain/entities/Invoice';
import { InvoiceItem } from '../../domain/entities/InvoiceItem';
import { DueDate } from '../../domain/value-objects/DueDate';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { IdGenerator } from '../ports/out/id-generator.port';
import { InvoiceCreatedEvent } from 'src/domain/events/invoice-created.event';
import { InvoiceCreatedIntegrationEvent } from '../events/invoice-created-integration.event';
import e from 'express';
import { CreateInvoiceUseCase } from '../ports/in/use-cases/create-invoice.use-case';

@Injectable()
export class CreateInvoiceService implements CreateInvoiceUseCase {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
    private readonly idGenerator: IdGenerator,
  ) {}

  async create(input: {
    clientId: string;
    items: InvoiceItem[];
    dueDate: DueDate;
    notes?: string;
    paymentMethodId: string;
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

    const domainEvents = invoice.getDomainEvents();

    const integrationEvents = domainEvents.map((event) => {
      if (event instanceof InvoiceCreatedEvent) {
        return InvoiceCreatedIntegrationEvent.fromDomainEvent(
          event,
          input.paymentMethodId,
        );
      }
      return event;
    });

    await this.eventBus.publish(integrationEvents);

    return invoice;
  }
}
