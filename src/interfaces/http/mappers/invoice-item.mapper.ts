import { InvoiceItem } from '../../../domain/entities/InvoiceItem';
import { Money } from '../../../domain/value-objects/Money';
import { AddInvoiceItemDto } from '../dtos/add-invoice-item.dto';

export class InvoiceItemMapper {
  static toDomain(dto: AddInvoiceItemDto): InvoiceItem {
    return new InvoiceItem(
      dto.description,
      dto.quantity,
      Money.of(dto.unitPrice.amount, dto.unitPrice.currency),
    );
  }

  static toResponse(item: InvoiceItem) {
    return {
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
    };
  }
}
