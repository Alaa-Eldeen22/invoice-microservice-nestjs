import { Column } from 'typeorm';

export class InvoiceItemEntity {
  @Column()
  description: string;

  @Column('int')
  quantity: number;

  @Column('decimal', { transformer: { 
      to: (m: string) => m, 
      from: (v: string) => v 
    }})
  unitPriceAmount: string;

  @Column()
  unitPriceCurrency: string;
}
