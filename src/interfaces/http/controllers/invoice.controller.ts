import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { InvoiceMapper } from '../mappers/invoice.mapper';
import { AddInvoiceItemDto } from '../dtos/add-invoice-item.dto';
import { InvoiceItemMapper } from '../mappers/invoice-item.mapper';
import { AddInvoiceItemUseCase } from 'src/application/ports/in/use-cases/add-invoice-item.use-case';
import { CreateInvoiceUseCase } from 'src/application/ports/in/use-cases/create-invoice.use-case';
import { RetryInvoiceUseCase } from 'src/application/ports/in/use-cases/retry-invoice.use-case';
import { RemoveInvoiceItemUseCase } from 'src/application/ports/in/use-cases/remove-invoice-item.use-case';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly addInvoiceItemUseCase: AddInvoiceItemUseCase,
    private readonly removeInvoiceItemUseCase: RemoveInvoiceItemUseCase,
    private readonly retryInvoiceUseCase: RetryInvoiceUseCase,
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
}
