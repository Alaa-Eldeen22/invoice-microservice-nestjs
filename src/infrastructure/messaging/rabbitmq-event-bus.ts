import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { EventBus } from '../../application/ports/event-bus.port';
import { DomainEvent } from '../../domain/events/DomainEvent';

@Injectable()
export class RabbitMQEventBus implements EventBus {
  private client: ClientProxy;
  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'invoice_events',
        queueOptions: { durable: true },
      },
    });
  }

  /**
   * Publishes a list of domain events to the RabbitMQ event bus.
   * @param events - An array of DomainEvent objects to be published
   */
  async publish(events: DomainEvent[]): Promise<void> {
    await this.client.connect();
    for (const event of events) {
      await this.client.emit(event.name, event).toPromise();
      console.log(`Event published: ${event.name}`);
    }
  }
}
