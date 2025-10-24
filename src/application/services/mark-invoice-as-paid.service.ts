import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { MarkInvoiceAsPaidUseCase } from '../ports/in/use-cases/mark-invoice-as-paid.use-case';

@Injectable()
export class MarkInvoiceAsPaidService implements MarkInvoiceAsPaidUseCase{
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async markAsPaid(invoiceId: string, paidAt: Date): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.markAsPaid(paidAt);

    await this.repository.save(invoice);
    await this.eventBus.publish(invoice.getDomainEvents());
  }
}
