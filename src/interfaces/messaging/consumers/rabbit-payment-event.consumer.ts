import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MarkInvoiceAsAuthorizedUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-authorized.use-case';
import { MarkInvoiceAsFailedUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-failed.use-case';

const PAYMENT_AUTHORIZED_ROUTING_KEY = 'payment.authorized';
const PAYMENT_FAILED_ROUTING_KEY = 'payment.failed';

@Injectable()
export class RabbitPaymentEventConsumer {
  constructor(
    private readonly markInvoiceAsAuthorizedUseCase: MarkInvoiceAsAuthorizedUseCase,
    private readonly markInvoiceAsFailedUseCase: MarkInvoiceAsFailedUseCase,
  ) {}

  @RabbitSubscribe({
    queue: 'payment_events',
  })
  async hadleMessage(msg: any, amqpMsg: any) {
    const routingKey = amqpMsg.fields.routingKey;

    switch (routingKey) {
      case PAYMENT_AUTHORIZED_ROUTING_KEY:
        await this.handlePaymentAuthorized(msg);
        break;
      case PAYMENT_FAILED_ROUTING_KEY:
        await this.handlePaymentFailed(msg);
        break;
      default:
        console.warn(`Unhandled routing key: ${routingKey}`);
    }
  }

  async handlePaymentAuthorized(msg: any) {
    console.log('Received Payment authorized message', msg);
    const authorizedAt = this.extractDate(msg);
    await this.markInvoiceAsAuthorizedUseCase.markAsAuthorized(
      msg.invoiceId,
      authorizedAt,
    );
  }

  async handlePaymentFailed(msg: any) {
    console.log('Received Payment failed message', msg);
    await this.markInvoiceAsFailedUseCase.markAsFailed(
      msg.invoiceId,
      msg.reason,
    );
  }

  private extractDate(msg: any): Date {
    const [year, month, day, hour, minute, second, nanosecond] = msg.occurredOn;

    const date = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      second,
      Math.floor(nanosecond / 1_000_000),
    );
    return date;
  }
}
