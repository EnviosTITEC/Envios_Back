import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuoteRecord } from './quote-record.schema';

@Injectable()
export class QuoteRecordService {
  constructor(@InjectModel(QuoteRecord.name) private quoteRecordModel: Model<QuoteRecord>) {}

  async saveQuoteRecord(data: any) {
    const created = new this.quoteRecordModel({ data });
    return created.save();
  }

  async findById(id: string) {
    return this.quoteRecordModel.findById(id);
  }

  async findAll() {
    return this.quoteRecordModel.find();
  }
}
