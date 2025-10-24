import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { CancelInvoiceUseCase } from '../ports/in/use-cases/cancel-invoice.use-case';

@Injectable()
export class CancelInvoiceService  implements CancelInvoiceUseCase{
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async cancel(invoiceId: string, reason: string): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.cancel(reason);

    await this.repository.save(invoice);
    await this.eventBus.publish(invoice.getDomainEvents());
  }
}