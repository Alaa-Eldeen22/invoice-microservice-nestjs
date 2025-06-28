import { Invoice } from '../../../domain/entities/Invoice';
import { InvoiceItem } from '../../../domain/entities/InvoiceItem';
import { Money } from '../../../domain/value-objects/Money';
import { DueDate } from '../../../domain/value-objects/DueDate';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';
import { CreateInvoiceDto } from 'src/interfaces/http/dtos/create-invoice.dto';

export class InvoiceMapper {
  static toResponse(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      clientId: invoice.clientId,
      items: invoice.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: {
          amount: item.unitPrice.amount,
          currency: item.unitPrice.currency,
        },
        total: {
          amount: item.total.amount,
          currency: item.total.currency,
        },
      })),
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
    items: InvoiceItem[];
    dueDate: DueDate;
    notes?: string;
  } {
    const items = dto.items.map((itemDto) => {
      const unitPrice = Money.of(
        itemDto.unitPrice.amount,
        itemDto.unitPrice.currency,
      );
      return new InvoiceItem(itemDto.description, itemDto.quantity, unitPrice);
    });

    const dueDate = new DueDate(new Date(dto.dueDate));

    return {
      clientId: dto.clientId,
      items,
      dueDate,
      notes: dto.notes,
    };
  }
}
