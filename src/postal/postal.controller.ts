import { Controller, Get } from '@nestjs/common';
import { PostalService, PostalRegion } from './postal.service';

@Controller('postal')
export class PostalController {
  constructor(private readonly postalService: PostalService) {}

  @Get('regions-tree')
  async getRegionsTree(): Promise<PostalRegion[]> {
    return this.postalService.getRegionsTree();
  }
}
