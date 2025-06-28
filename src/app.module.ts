import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { InvoiceModule } from './modules/invoice.module';

@Module({
  imports: [DatabaseModule, InvoiceModule],
})
export class AppModule {}
