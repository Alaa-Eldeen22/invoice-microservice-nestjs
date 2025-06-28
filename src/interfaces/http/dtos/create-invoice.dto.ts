export interface CreateInvoiceDto {
  clientId: string;
  items: InvoiceItemDto[];
  dueDate: string;
  notes?: string;
}

export interface InvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: {
    amount: number;
    currency: string;
  };
}
