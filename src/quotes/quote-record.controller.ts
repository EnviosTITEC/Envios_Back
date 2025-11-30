import { Body, Controller, Post, Get, Param, NotFoundException } from '@nestjs/common';
import { QuoteRecordService } from './quote-record.service';

@Controller('quotes/record')
export class QuoteRecordController {
  constructor(private readonly quoteRecordService: QuoteRecordService) {}

  @Post()
  async save(@Body() body: any) {
    return this.quoteRecordService.saveQuoteRecord(body);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const record = await this.quoteRecordService.findById(id);
    if (!record) throw new NotFoundException('Quote record not found');
    return record;
  }
}
