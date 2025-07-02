import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventBus } from 'src/application/ports/event-bus.port';
import { IdGenerator } from 'src/application/ports/id-generator.port';
import { CreateInvoiceUseCase } from 'src/application/use-cases/create-invoice.use-case';
import { MarkInvoiceAsPaidUseCase } from 'src/application/use-cases/mark-invoice-as-paid.use-case';
import { InvoiceRepository } from 'src/domain/repositories/InvoiceRepository';
import { InvoiceEntity } from 'src/infrastructure/database/entities/invoice.entity';
import { TypeormInvoiceRepository } from 'src/infrastructure/database/repositories/invoice.repository';
import { RabbitMQEventBus } from 'src/infrastructure/messaging/rabbitmq-event-bus';
import { UuidGenerator } from 'src/infrastructure/services/uuid-generator.service';
import { InvoiceController } from 'src/interfaces/http/controllers/invoice.controller';
import { PaymentSucceededListener } from 'src/interfaces/messaging/listeners/payment-succeeded.listener';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  controllers: [InvoiceController, PaymentSucceededListener],
  providers: [
    CreateInvoiceUseCase,
    MarkInvoiceAsPaidUseCase,

    { provide: InvoiceRepository, useClass: TypeormInvoiceRepository },
    { provide: EventBus, useClass: RabbitMQEventBus },
    { provide: IdGenerator, useClass: UuidGenerator },
  ],
})
export class InvoiceModule {}
