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

  @Get('/chilexpress/regions')
  @ApiOperation({
    summary: 'Obtener regiones de Chilexpress',
    description: 'Obtiene las regiones disponibles en Chilexpress',
  })
  async getChilexpressRegions(): Promise<ChilexpressRegion[]> {
    return this.geoService.getChilexpressRegions();
  }

  @Get('/chilexpress/coverage-areas')
  @ApiOperation({
    summary: 'Obtener áreas de cobertura de Chilexpress',
    description: 'Obtiene las comunas/áreas de cobertura para una región específica',
  })
  @ApiQuery({
    name: 'regionCode',
    type: 'string',
    description: 'Código de región de Chilexpress',
  })
  @ApiQuery({
    name: 'type',
    type: 'number',
    default: 0,
    description: 'Tipo de consulta (0 = todas las áreas)',
    required: false,
  })
  async getChilexpressCoverageAreas(
    @Query('regionCode') regionCode: string,
    @Query('type') type: number = 0,
  ): Promise<ChilexpressCoverageArea[]> {
    return this.geoService.getChilexpressCoverageAreas(regionCode, type);
  }

  @Get('/chilexpress/county-by-name/:communeName')
  @ApiOperation({
    summary: 'Buscar county code por nombre de comuna',
    description: 'Busca un código de Chilexpress por nombre de comuna',
  })
  @ApiParam({
    name: 'communeName',
    type: 'string',
    description: 'Nombre de la comuna a buscar',
  })
  async findChilexpressCountyByName(
    @Param('communeName') communeName: string,
  ): Promise<{
    countyCode: string;
    countyName: string;
    regionId: string;
  } | null> {
    return this.geoService.findChilexpressCountyByName(communeName);
  }
}
