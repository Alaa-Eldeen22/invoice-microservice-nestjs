export interface InvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: {
    amount: number;
    currency: string;
  };
}