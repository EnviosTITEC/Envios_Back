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
    summary: 'Obtener regiones de Chile (API Gobierno)',
    description: 'Obtiene regiones, provincias y comunas desde la API DPA del gobierno de Chile',
  })
  async getRegions(): Promise<GeoRegion[]> {
    return this.geoService.getRegions();
  }

  @Get('/chilexpress/regions')
  @ApiOperation({
    summary: 'Obtener regiones de Chilexpress',
    description: 'Obtiene las regiones disponibles en el sistema de Chilexpress',
  })
  async getChilexpressRegions(): Promise<ChilexpressRegion[]> {
    return this.geoService.getChilexpressRegions();
  }

  @Get('/chilexpress/coverage-areas')
  @ApiOperation({
    summary: 'Obtener áreas de cobertura de Chilexpress',
    description: 'Obtiene las comunas/áreas de cobertura de una región específica en Chilexpress',
  })
  @ApiQuery({
    name: 'regionCode',
    required: true,
    description: 'Código de región de Chilexpress',
    example: 'RM',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    description: 'Tipo de área de cobertura (0 = todas)',
    example: 0,
  })
  async getChilexpressCoverageAreas(
    @Query('regionCode') regionCode: string,
    @Query('type') type?: number,
  ): Promise<ChilexpressCoverageArea[]> {
    return this.geoService.getChilexpressCoverageAreas(
      regionCode,
      type ?? 0,
    );
  }

}
