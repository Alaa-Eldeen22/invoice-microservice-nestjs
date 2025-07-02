import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case';
import { InvoiceMapper } from '../mappers/invoice.mapper';
import { DomainEvent } from 'src/domain/events/DomainEvent';
import { EventBus } from 'src/application/ports/event-bus.port';

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
    private readonly createInvoicUseCase: CreateInvoiceUseCase,
    private readonly eventBus: EventBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    const domainInput = InvoiceMapper.toDomainInput(dto);
    const invoice = await this.createInvoicUseCase.execute(domainInput);
    return InvoiceMapper.toResponse(invoice);
  }

  @Get(":id")
  async find(@Query('id') id: string) {
    const testEvent = new TestEvent(id, new Date());

    await this.eventBus.publish([testEvent]);
    return { message: 'Test event published successfully' };
  }
}
