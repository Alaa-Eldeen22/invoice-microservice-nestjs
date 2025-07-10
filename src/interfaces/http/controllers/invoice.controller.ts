import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case';
import { InvoiceMapper } from '../mappers/invoice.mapper';
import { DomainEvent } from 'src/domain/events/DomainEvent';
import { EventBus } from 'src/application/ports/event-bus.port';
import { CancelInvoiceUseCase } from 'src/application/use-cases/cancel-invoice.use-case';

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
    private readonly cancelInvoiceUseCase: CancelInvoiceUseCase,
    private readonly eventBus: EventBus,
  ) {}

  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    const domainInput = InvoiceMapper.toDomainInput(dto);
    const invoice = await this.createInvoicUseCase.execute(domainInput);
    return InvoiceMapper.toResponse(invoice);
  }

  @Patch(':id/cancel')
  async cancel(@Query('id') id: string, @Body('reason') reason: string) {
    await this.cancelInvoiceUseCase.execute(id, reason);
    return { message: 'Invoice canceled' };
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    const testEvent = new TestEvent(id, new Date());
    await this.eventBus.publish([testEvent]);
    return { message: 'Test event published successfully' };
  }
}
