import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQEventBus } from 'src/infrastructure/messaging/rabbitmq-event-bus';
import { EventBus } from 'src/application/ports/event-bus.port';
@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'invoice_events',
          type: 'topic',
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: {
        wait: true,
      },
      channels: {
        default: {
          prefetchCount: 10,
          default: true,
        },
      },
    }),
  ],
  providers: [
    {
      provide: EventBus,
      useClass: RabbitMQEventBus,
    },
  ],
  exports: [EventBus],
})
export class MessagingModule {}
