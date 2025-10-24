import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { InvoiceItem } from '../../domain/entities/InvoiceItem';
import { AddInvoiceItemUseCase } from '../ports/in/use-cases/add-invoice-item.use-case';

@Injectable()
export class AddInvoiceItemService implements AddInvoiceItemUseCase {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async add(invoiceId: string, item: InvoiceItem): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ${invoiceId} not found`);
    }

    invoice.addItem(item);

    await this.repository.save(invoice);
    await this.eventBus.publish(invoice.getDomainEvents());
  }
}
