import { Injectable } from '@nestjs/common';
import { InvoiceRepository } from 'src/domain/repositories/InvoiceRepository';
import { EventBus } from '../ports/out/event-bus.port';
import { CaptureInvoiceUseCase } from '../ports/in/use-cases/capture-invoice.use-case';

@Injectable()
export class CaptureInvoiceService implements CaptureInvoiceUseCase {
  constructor(
    private readonly repository: InvoiceRepository,
    private readonly eventBus: EventBus,
  ) {}

  async capture(invoiceId: string, paidAt: Date): Promise<void> {
    const invoice = await this.repository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }

    // Capture typically results in marking the invoice as paid
    invoice.markAsPaid(paidAt);

    await this.repository.save(invoice);

    const events = invoice.getDomainEvents();
    if (events && events.length) {
      await this.eventBus.publish(events);
    }
  }
}
