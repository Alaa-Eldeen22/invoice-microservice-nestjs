import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InvoiceItemEntity } from './invoice-item.entity';
import { InvoiceStatus } from 'src/domain/enums/InvoiceStatus';

@Entity({ name: 'invoices' })
export class InvoiceEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  clientId: string;

  @Column('jsonb')
  items: InvoiceItemEntity[];

  @Column('decimal', {
    transformer: {
      to: (m: string) => m,
      from: (v: string) => v,
    },
  })
  totalAmount: string;

  @Column()
  totalCurrency: string;


  @Column()
  status: InvoiceStatus;

  @Column('timestamptz')
  dueDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('timestamptz', { nullable: true })
  paidAt?: Date;

  @Column('timestamptz', { nullable: true })
  canceledAt?: Date;

  @Column({ nullable: true })
  notes?: string;
}
