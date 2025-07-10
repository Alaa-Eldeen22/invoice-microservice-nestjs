import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/event-bus.port';

@Injectable()
export class MarkInvoiceAsFailedUseCase {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(invoiceId: string, reason: string): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.markAsFailed(reason);

    await this.repository.save(invoice);
    await this.eventBus.publish(invoice.getDomainEvents());
  }
}