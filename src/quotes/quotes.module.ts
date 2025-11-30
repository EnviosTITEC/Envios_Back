import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { ChilexpressAdapter } from '../carriers/adapters/chilexpress-adapters';
import { QuoteRecord, QuoteRecordSchema } from './quote-record.schema';
import { QuoteRecordService } from './quote-record.service';
import { QuoteRecordController } from './quote-record.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: QuoteRecord.name, schema: QuoteRecordSchema }]),
  ],
  controllers: [QuotesController, QuoteRecordController],
  providers: [QuotesService, ChilexpressAdapter, QuoteRecordService],
})
export class QuotesModule {}
