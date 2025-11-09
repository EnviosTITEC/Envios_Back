import { Controller, Get } from '@nestjs/common';
import { GeoService, GeoRegion } from './geo.service';

@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('/cl/regions')
  async getRegions(): Promise<GeoRegion[]> {
    return this.geoService.getRegions();
  }
}
