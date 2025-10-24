import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from 'src/domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { MarkInvoiceAsAuthorizedUseCase } from '../ports/in/use-cases/mark-invoice-as-authorized.use-case';

@Injectable()
export class MarkInvoiceAsAuthorizedService
  implements MarkInvoiceAsAuthorizedUseCase
{
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async markAsAuthorized(invoiceId: string, authorizedAt: Date): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }

    invoice.markAsAuthorized(authorizedAt);

    await this.repository.save(invoice);

    const events = invoice.getDomainEvents();
    if (events && events.length) {
      await this.eventBus.publish(events);
    }
  }
}
