export abstract class InvoiceResponseDto {
  id: string;
  clientId: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: {
      amount: number;
      currency: string;
    };
    total: {
      amount: number;
      currency: string;
    };
  }[];
  total: {
    amount: number;
    currency: string;
  };
  status: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  canceledAt?: string;
  notes?: string;
}
