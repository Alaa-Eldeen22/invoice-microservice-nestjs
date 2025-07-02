import { Invoice } from 'src/domain/entities/Invoice';
import { InvoiceEntity } from '../entities/invoice.entity';
import { InvoiceItem } from 'src/domain/entities/InvoiceItem';
import { DueDate } from 'src/domain/value-objects/DueDate';
import { Money } from 'src/domain/value-objects/Money';

export class InvoiceMapper {
   static toDomain(entity: InvoiceEntity): Invoice {
    // Convert entity items to domain objects
    const invoiceItems = entity.items.map(
      (item) =>
        new InvoiceItem(
          item.description,
          item.quantity,
          Money.of(
            parseFloat(item.unitPriceAmount),
            item.unitPriceCurrency,
          ),
        ),
    );

    // Create domain value objects
    const invoiceDueDate = new DueDate(entity.dueDate);
    const invoiceTotal = Money.of(
      parseFloat(entity.totalAmount),
      entity.totalCurrency,
    );

    // Use reconstruct method to rebuild domain object from persisted state
    const invoice = Invoice.reconstruct(
      entity.id,
      entity.clientId,
      invoiceItems,
      invoiceTotal,
      entity.status,
      invoiceDueDate,
      entity.createdAt,
      entity.updatedAt,
      entity.paidAt,
      entity.canceledAt,
      entity.notes,
    );

    return invoice;
  }

  static toEntity(invoice: Invoice): InvoiceEntity {
    const entity = new InvoiceEntity();

    // Basic invoice properties
    entity.id = invoice.id;
    entity.clientId = invoice.clientId;
    entity.status = invoice.status;
    entity.notes = invoice.notes;

    // Date properties
    entity.dueDate = invoice.dueDate.value;
    entity.createdAt = invoice.createdAt;
    entity.updatedAt = invoice.updatedAt;
    entity.paidAt = invoice.paidAt;
    entity.canceledAt = invoice.canceledAt;

    // Convert invoice items to entity format
    entity.items = invoice.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPriceAmount: item.unitPrice.amount.toString(),
      unitPriceCurrency: item.unitPrice.currency,
    }));

    // Convert total amount to entity format
    entity.totalAmount = invoice.total.amount.toString();
    entity.totalCurrency = invoice.total.currency;

    return entity;
  }
}
