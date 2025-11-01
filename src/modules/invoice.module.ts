import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UuidGenerator } from 'src/application/services/uuid-generator.service';
import { TypeormInvoiceRepository } from 'src/infrastructure/database/repositories/invoice.repository';
import { InvoiceEntity } from 'src/infrastructure/database/entities/invoice.entity';
import { InvoiceController } from 'src/interfaces/http/controllers/invoice.controller';
import { MessagingModule } from './messaging.module';
import { IdGenerator } from 'src/application/ports/out/id-generator.port';
import { InvoiceRepository } from 'src/domain/repositories/InvoiceRepository';
import { RabbitPaymentEventConsumer } from 'src/interfaces/messaging/consumers/rabbit-payment-event.consumer';
import { AddInvoiceItemUseCase } from 'src/application/ports/in/use-cases/add-invoice-item.use-case';
import { CancelInvoiceUseCase } from 'src/application/ports/in/use-cases/cancel-invoice.use-case';
import { CreateInvoiceUseCase } from 'src/application/ports/in/use-cases/create-invoice.use-case';
import { MarkInvoiceAsFailedUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-failed.use-case';
import { MarkInvoiceAsPaidUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-paid.use-case';
import { RetryInvoiceUseCase } from 'src/application/ports/in/use-cases/retry-invoice.use-case';
import { RemoveInvoiceItemUseCase } from 'src/application/ports/in/use-cases/remove-invoice-item.use-case';
import { CreateInvoiceService } from 'src/application/services/create-invoice.service';
import { AddInvoiceItemService } from 'src/application/services/add-invoice-item.service';
import { CancelInvoiceService } from 'src/application/services/cancel-invoice.service';
import { MarkInvoiceAsFailedService } from 'src/application/services/mark-invoice-as-failed.service';
import { MarkInvoiceAsPaidService } from 'src/application/services/mark-invoice-as-paid.service';
import { RetryInvoiceService } from 'src/application/services/retry-invoice.service';
import { RemoveInvoiceItemService } from 'src/application/services/remove-invoice-item.service';
import { MarkInvoiceAsAuthorizedUseCase } from 'src/application/ports/in/use-cases/mark-invoice-as-authorized.use-case';
import { MarkInvoiceAsAuthorizedService } from 'src/application/services/mark-invoice-as-authorized.service';
import { CaptureInvoiceUseCase } from 'src/application/ports/in/use-cases/capture-invoice.use-case';
import { CaptureInvoiceService } from 'src/application/services/capture-invoice.service';
@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity]), MessagingModule],
  controllers: [InvoiceController],
  providers: [
    { provide: CreateInvoiceUseCase, useClass: CreateInvoiceService },
    { provide: AddInvoiceItemUseCase, useClass: AddInvoiceItemService },
    { provide: RemoveInvoiceItemUseCase, useClass: RemoveInvoiceItemService },
    { provide: CancelInvoiceUseCase, useClass: CancelInvoiceService },
    { provide: RetryInvoiceUseCase, useClass: RetryInvoiceService },
    { provide: MarkInvoiceAsPaidUseCase, useClass: MarkInvoiceAsPaidService },
    {
      provide: MarkInvoiceAsFailedUseCase,
      useClass: MarkInvoiceAsFailedService,
    },
    {
      provide: MarkInvoiceAsAuthorizedUseCase,
      useClass: MarkInvoiceAsAuthorizedService,
    },
    {
      provide: CaptureInvoiceUseCase,
      useClass: CaptureInvoiceService,
    },
    { provide: InvoiceRepository, useClass: TypeormInvoiceRepository },
    { provide: IdGenerator, useClass: UuidGenerator },
    RabbitPaymentEventConsumer,
  ],
})
export class InvoiceModule {}
