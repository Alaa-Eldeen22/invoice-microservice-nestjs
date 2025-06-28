import { Controller, Post, Body, Get } from '@nestjs/common';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { CreateInvoiceUseCase } from '../../../application/use-cases/create-invoice.use-case';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly createInvoicUseCase: CreateInvoiceUseCase) {}

  @Post()
  @Post()
  async create(@Body() dto: CreateInvoiceDto) {
    const domainInput = InvoiceMapper.toDomainInput(dto);
    const invoice = await this.createInvoicUseCase.execute(domainInput);
    return InvoiceMapper.toResponse(invoice);
  }
  @Get()
  async find() {
    return 'This is a placeholder for the find method. Implement your logic here.';
  }
}
