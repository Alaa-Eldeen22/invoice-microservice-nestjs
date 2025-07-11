import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import rabbitmqConfig from './config/rabbitmq.config'; // ✅ this
import { DatabaseModule } from './infrastructure/database/database.module';
import { InvoiceModule } from './modules/invoice.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [rabbitmqConfig, databaseConfig],
    }),
    DatabaseModule,
    InvoiceModule,
  ],
})
export class AppModule {}
