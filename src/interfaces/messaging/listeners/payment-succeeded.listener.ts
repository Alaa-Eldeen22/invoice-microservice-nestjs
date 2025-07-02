import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentSucceededEvent } from '../events/payment-succeeded.event';
import { MarkInvoiceAsPaidUseCase } from '../../../application/use-cases/mark-invoice-as-paid.use-case';

@Controller()
export class PaymentSucceededListener {
  constructor(private readonly markPaid: MarkInvoiceAsPaidUseCase) {}

  @EventPattern('payment.succeeded')
  async handle(@Payload() event: PaymentSucceededEvent) {
    await this.markPaid.execute(event.invoiceId, new Date(event.paidAt));
  }
  @EventPattern('invoice.paid')
  async handle2(@Payload() event: PaymentSucceededEvent) {
    console.log(`Handling invoice paid event for invoice ${event.invoiceId}`);
  }
}
