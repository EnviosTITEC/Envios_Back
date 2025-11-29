import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';
import { ChilexpressAdapter } from '../carriers/adapters/chilexpress-adapters';

@Module({
  imports: [HttpModule],
  controllers: [QuotesController],
  providers: [QuotesService, ChilexpressAdapter],
})
export class QuotesModule {}
