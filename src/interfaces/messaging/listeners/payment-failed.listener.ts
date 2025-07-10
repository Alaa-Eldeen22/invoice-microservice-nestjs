import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MarkInvoiceAsFailedUseCase } from '../../../application/use-cases/mark-invoice-as-failed.use-case';
import { PaymentFailedEvent } from '../events/payment-failed.event';
@Controller()
export class PaymentFailedListener {
  constructor(private readonly markFailed: MarkInvoiceAsFailedUseCase) {}

  @EventPattern('payment.failed')
  async handle(@Payload() event: PaymentFailedEvent) {
    await this.markFailed.execute(event.invoiceId, event.reason);
  }
}
