import { Injectable } from '@nestjs/common';
import { ChilexpressAdapter } from '../carriers/adapters/chilexpress-adapters';

@Injectable()
export class QuotesService {
  constructor(private readonly chilexpress: ChilexpressAdapter) {}

  async quote(dto: any): Promise<any> {
    return this.chilexpress.getQuote(dto);
  }
}
