import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQEventBus } from 'src/infrastructure/messaging/rabbitmq-event-bus';
import { EventBus } from 'src/application/ports/out/event-bus.port';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,

    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const rabbit = configService.get('rabbitmq');
        return {
          exchanges: [
            {
              name: rabbit.exchangeName,
              type: rabbit.exchangeType,
            },
          ],
          uri: rabbit.uri,
          connectionInitOptions: {
            wait: true,
          },
          channels: {
            default: {
              prefetchCount: rabbit.prefetchCount,
              default: true,
            },
          },
        };
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
