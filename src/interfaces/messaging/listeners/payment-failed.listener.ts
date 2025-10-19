import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MarkInvoiceAsFailedUseCase } from '../../../application/use-cases/mark-invoice-as-failed.use-case';
import { PaymentFailedEvent } from '../events/payment-failed.event';

@Injectable()
export class PaymentFailedListener {
  constructor(private readonly markFailed: MarkInvoiceAsFailedUseCase) {}

  @RabbitSubscribe({
    exchange: 'invoice_events',
    routingKey: 'payment.failed',
    queue: 'invoice.payment-failed-queue',
  })
  async handleFailed(event: PaymentFailedEvent) {
    await this.markFailed.execute(event.invoiceId, event.reason);
  }
}
