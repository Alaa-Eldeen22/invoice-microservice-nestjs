import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MarkInvoiceAsPaidUseCase } from '../../../application/use-cases/mark-invoice-as-paid.use-case';
import { PaymentSucceededEvent } from '../events/payment-succeeded.event';

@Injectable()
export class PaymentSucceededListener {
  constructor(private readonly markPaid: MarkInvoiceAsPaidUseCase) {}

  @RabbitSubscribe({
    exchange: 'invoice_events',
    routingKey: 'payment.succeeded',
    queue: 'invoice.payment-succeeded-queue',
  })
  async handleSucceeded(event: PaymentSucceededEvent) {
    try {
      console.log(
        `Handling payment succeeded event for invoice ${event.invoiceId}`,
      );
      await this.markPaid.execute(event.invoiceId, new Date(event.paidAt));
    } catch (error) {
      console.error(
        `Error handling payment succeeded event for invoice ${event.invoiceId}:`,
        error,
      );
    }
  }

  @RabbitSubscribe({
    exchange: 'invoice_events',
    routingKey: 'invoice.paid',
    queue: 'invoice.paid-logging-queue',
  })
  async handleInvoicePaid(event: PaymentSucceededEvent) {
    console.log(`Handling invoice paid event for invoice ${event.invoiceId}`);
  }
}
