import { Invoice } from '../../../domain/entities/Invoice';
import { InvoiceItemMapper } from './invoice-item.mapper';
import { DueDate } from '../../../domain/value-objects/DueDate';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { CreateInvoiceDto } from 'src/interfaces/http/dtos/create-invoice.dto';

export class InvoiceMapper {
  static toResponse(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      clientId: invoice.clientId,
      items: invoice.items.map(InvoiceItemMapper.toResponse),
      total: {
        amount: invoice.total.amount,
        currency: invoice.total.currency,
      },
      status: invoice.status,
      dueDate: invoice.dueDate.value.toISOString(),
      createdAt: invoice.createdAt.toISOString(),
      updatedAt: invoice.updatedAt.toISOString(),
      paidAt: invoice.paidAt?.toISOString(),
      canceledAt: invoice.canceledAt?.toISOString(),
      notes: invoice.notes,
    };
  }

  static toDomainInput(dto: CreateInvoiceDto): {
    clientId: string;
    paymentMethodId: string;
    items: any[];
    dueDate: DueDate;
    notes?: string;
  } {
    const items = dto.items.map((itemDto) =>
      InvoiceItemMapper.toDomain(itemDto),
    );

    const dueDate = new DueDate(new Date(dto.dueDate));

    return {
      clientId: dto.clientId,
      items,
      dueDate,
      notes: dto.notes,
      paymentMethodId: dto.paymentMethodId,
    };
  }
}
