import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import {
  GeoService,
  GeoRegion,
  ChilexpressRegion,
  ChilexpressCoverageArea,
} from './geo.service';

@ApiTags('Geo')
@Controller('geo')
export class GeoController {
  constructor(private readonly geoService: GeoService) {}

  @Get('/cl/regions')
  @ApiOperation({
    summary: 'Obtener regiones de Chile',
    description: 'Obtiene regiones, provincias y comunas',
  })
  async getRegions(): Promise<GeoRegion[]> {
    return this.geoService.getRegions();
  }

}
