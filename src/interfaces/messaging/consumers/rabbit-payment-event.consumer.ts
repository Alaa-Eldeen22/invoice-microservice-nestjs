import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MarkInvoiceAsAuthorizedUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-authorized.use-case';
import { MarkInvoiceAsFailedUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-failed.use-case';
import { CaptureInvoiceUseCase } from 'src/application/ports/in/use-cases/capture-invoice.use-case';
import { CancelInvoiceUseCase } from 'src/application/ports/in/use-cases/cancel-invoice.use-case';

const PAYMENT_AUTHORIZED_ROUTING_KEY = 'payment.authorized';
const PAYMENT_FAILED_ROUTING_KEY = 'payment.failed';
const PAYMENT_CAPTURED_ROUTING_KEY = 'payment.captured';
const PAYMENT_VOIDED_ROUTING_KEY = 'payment.voided';

@Injectable()
export class RabbitPaymentEventConsumer {
  constructor(
    private readonly markInvoiceAsAuthorizedUseCase: MarkInvoiceAsAuthorizedUseCase,
    private readonly markInvoiceAsFailedUseCase: MarkInvoiceAsFailedUseCase,
    private readonly captureInvoiceUseCase: CaptureInvoiceUseCase,
    private readonly cancelInvoiceUseCase: CancelInvoiceUseCase,
  ) {}

  @RabbitSubscribe({
    queue: 'payment_events',
  })
  async hadleMessage(msg: any, amqpMsg: any) {
    const routingKey = amqpMsg.fields.routingKey;

    switch (routingKey) {
      case PAYMENT_AUTHORIZED_ROUTING_KEY:
        this.handlePaymentAuthorized(msg);
        break;
      case PAYMENT_FAILED_ROUTING_KEY:
        this.handlePaymentFailed(msg);
        break;
      case PAYMENT_CAPTURED_ROUTING_KEY:
        this.handlePaymentCaptured(msg);
        break;
      case PAYMENT_VOIDED_ROUTING_KEY:
        this.handlePaymentCanceled(msg);
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

  async handlePaymentCaptured(msg: any) {
    console.log('Received Payment captured message', msg);
    const capturedAt = this.extractDate(msg);

    await this.captureInvoiceUseCase.capture(msg.invoiceId, capturedAt);
  }

  async handlePaymentCanceled(msg: any) {
    console.log('Received Payment canceled message', msg);
    const canceledAt = this.extractDate(msg);
    await this.cancelInvoiceUseCase.cancel(msg.invoiceId, canceledAt);
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
