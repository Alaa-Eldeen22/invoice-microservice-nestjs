import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { MarkInvoiceAsFailedUseCase } from '../ports/in/use-cases/mark-invoice-as-failed.use-case';

@Injectable()
export class MarkInvoiceAsFailedService implements MarkInvoiceAsFailedUseCase {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async markAsFailed(invoiceId: string, reason?: string): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.markAsFailed(reason);

    await this.repository.save(invoice);
    await this.eventBus.publish(invoice.getDomainEvents());
  }
}
