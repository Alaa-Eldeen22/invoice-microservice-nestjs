import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from 'src/domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { Invoice } from 'src/domain/entities/Invoice';
import { InvoiceRetriedEvent } from 'src/domain/events/invoice-retried.event';
import { InvoiceRetriedIntegrationEvent } from '../events/invoice-retried-integration.event';
import { RetryInvoiceUseCase } from '../ports/in/use-cases/retry-invoice.use-case';

@Injectable()
export class RetryInvoiceService  implements RetryInvoiceUseCase{
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async retry(invoiceId: string, paymentMethodId: string): Promise<Invoice> {
    const invoice = (await this.repository.findById(invoiceId)) as Invoice;
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.retry();
    const domainEvents = invoice.getDomainEvents();

    const integrationEvents = domainEvents.map((event) => {
      if (event instanceof InvoiceRetriedEvent) {
        return InvoiceRetriedIntegrationEvent.fromDomainEvent(
          event,
          paymentMethodId,
        );
      }
      return event;
    });

    await this.eventBus.publish(integrationEvents);

    return invoice;
  }
}
