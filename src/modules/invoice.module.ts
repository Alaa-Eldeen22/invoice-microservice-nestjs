import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UuidGenerator } from 'src/infrastructure/services/uuid-generator.service';
import { TypeormInvoiceRepository } from 'src/infrastructure/database/repositories/invoice.repository';
import { InvoiceEntity } from 'src/infrastructure/database/entities/invoice.entity';
import { InvoiceController } from 'src/interfaces/http/controllers/invoice.controller';
import { CreateInvoiceUseCase } from 'src/application/use-cases/create-invoice.use-case';
import { MarkInvoiceAsPaidUseCase } from 'src/application/use-cases/mark-invoice-as-paid.use-case';
import { MarkInvoiceAsFailedUseCase } from 'src/application/use-cases/mark-invoice-as-failed.use-case';
import { CancelInvoiceUseCase } from 'src/application/use-cases/cancel-invoice.use-case';
import { PaymentSucceededListener } from 'src/interfaces/messaging/listeners/payment-succeeded.listener';
import { PaymentFailedListener } from 'src/interfaces/messaging/listeners/payment-failed.listener';
import { MessagingModule } from './messaging.module';
import { IdGenerator } from 'src/application/ports/id-generator.port';
import { InvoiceRepository } from 'src/domain/repositories/InvoiceRepository';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity]), MessagingModule],
  controllers: [InvoiceController],
  providers: [
    CreateInvoiceUseCase,
    MarkInvoiceAsPaidUseCase,
    MarkInvoiceAsFailedUseCase,
    CancelInvoiceUseCase,
    { provide: InvoiceRepository, useClass: TypeormInvoiceRepository },
    { provide: IdGenerator, useClass: UuidGenerator },
    PaymentSucceededListener,
    PaymentFailedListener,
  ],
})
export class InvoiceModule {}
