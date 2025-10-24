import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DomainEvent } from 'src/domain/events/DomainEvent';
import { EventBus } from 'src/application/ports/out/event-bus.port';

@Injectable()
export class RabbitMQEventBus implements EventBus {
  constructor(private readonly amqp: AmqpConnection) {}

  /**
   * Publishes each DomainEvent onto the 'invoice_events' exchange using
   * its .name as the routing key.
   */
  async publish(events: any[]): Promise<void> {
    for (let event of events) {
      if ('clientId' in event) {
        event['customerId'] = event['clientId'];
        delete event['clientId'];
      }
      this.amqp.publish('invoice_events', event.name, event);
      console.log('customerId', event['customerId']);
      console.log(`Event published: ${event.name}`);
    }
  }
}
