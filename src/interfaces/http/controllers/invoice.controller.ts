import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { InvoiceMapper } from '../mappers/invoice.mapper';
import { DomainEvent } from 'src/domain/events/DomainEvent';
import { EventBus } from 'src/application/ports/out/event-bus.port';
import { AddInvoiceItemDto } from '../dtos/add-invoice-item.dto';
import { InvoiceItemMapper } from '../mappers/invoice-item.mapper';
import { AddInvoiceItemUseCase } from 'src/application/ports/in/use-cases/add-invoice-item.use-case';
import { CancelInvoiceUseCase } from 'src/application/ports/in/use-cases/cancel-invoice.use-case';
import { CreateInvoiceUseCase } from 'src/application/ports/in/use-cases/create-invoice.use-case';
import { RetryInvoiceUseCase } from 'src/application/ports/in/use-cases/retry-invoice.use-case';
import { RemoveInvoiceItemUseCase } from 'src/application/ports/in/use-cases/remove-invoice-item.use-case';

class TestEvent implements DomainEvent {
  public occurredOn: Date;
  public invoiceId: string;

  constructor(
    invoiceId: string,
    public paidAt: Date,
  ) {
    this.invoiceId = invoiceId;
    this.paidAt = paidAt;
    this.occurredOn = new Date();
  }
  get name(): string {
    return 'payment.succeeded';
  }
}

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly cancelInvoiceUseCase: CancelInvoiceUseCase,
    private readonly addInvoiceItemUseCase: AddInvoiceItemUseCase,
    private readonly removeInvoiceItemUseCase: RemoveInvoiceItemUseCase,
    private readonly retryInvoiceUseCase: RetryInvoiceUseCase,

    private readonly eventBus: EventBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    const domainInput = InvoiceMapper.toDomainInput(dto);

    const invoice = await this.createInvoiceUseCase.create(domainInput);
    return InvoiceMapper.toResponse(invoice);
  }

  @Post(':id/retry')
  async retry(
    @Param('id') id: string,
    @Body('paymentMethodId') paymentMethodId: string,
  ) {
    const invoice = await this.retryInvoiceUseCase.retry(id, paymentMethodId);
    return InvoiceMapper.toResponse(invoice);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Body('reason') reason: string) {
    await this.cancelInvoiceUseCase.cancel(id, reason);
    return { message: 'Invoice canceled' };
  }

  @Patch(':id/add-item')
  async addItem(@Param('id') id: string, @Body() dto: AddInvoiceItemDto) {
    const item = InvoiceItemMapper.toDomain(dto);
    await this.addInvoiceItemUseCase.add(id, item);
    return { message: 'Item added to invoice' };
  }

  @Patch(':id/remove-item')
  async removeItem(@Param('id') id: string, @Body('index') index: number) {
    await this.removeInvoiceItemUseCase.remove(id, index);
    return { message: 'Item removed from invoice' };
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    const testEvent = new TestEvent(id, new Date());
    await this.eventBus.publish([testEvent]);
    return { message: 'Test event published successfully' };
  }
}
