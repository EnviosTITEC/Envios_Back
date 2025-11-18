import { Injectable, HttpException, NotFoundException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

export interface GeoCommune {
  code: string;
  name: string;
}

export interface GeoProvince {
  code: string;
  name: string;
  communes: GeoCommune[];
}

export interface GeoCounty {
  countyCode: string;
  countyName: string;
  coverageAreaId?: string;
  coverageAreaName?: string;
}

export interface GeoRegion {
  regionId: string;
  regionName: string;
  ineRegionCode?: number;
  counties: GeoCounty[];
}

// Interfaces para Chilexpress API
export interface ChilexpressRegion {
  regionId: string;
  regionName: string;
  ineRegionCode?: number;
}

export interface ChilexpressCoverageArea {
  countyCode: string;
  countyName: string;
  coverageAreaId: string;
  coverageAreaName: string;
}

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private cache: GeoRegion[] | null = null;
  private chilexpressRegionsCache: ChilexpressRegion[] | null = null;
  private chilexpressCoverageCache: Map<string, ChilexpressCoverageArea[]> = new Map();

  constructor(private readonly httpService: HttpService) {}

  /**
   * Obtiene las regiones desde la API de Chilexpress
   */
  async getChilexpressRegions(): Promise<ChilexpressRegion[]> {
    if (this.chilexpressRegionsCache) {
      return this.chilexpressRegionsCache;
    }

    const url = 'https://testservices.wschilexpress.com/georeference/api/v1.0/regions';
    const headers = {
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '247c52cd60cc45b281e92f83d165c135',
    };

    this.logger.debug(`Fetching Chilexpress regions → GET ${url}`);

    try {
      const response$ = this.httpService.get(url, { headers });
      const response = await lastValueFrom(response$);

      if (response.data && response.data.regions) {
        this.chilexpressRegionsCache = response.data.regions;
        return response.data.regions;
      }

      this.logger.error('No regions found in Chilexpress response');
      return [];
    } catch (error: any) {
      this.logger.error(`Error fetching Chilexpress regions: ${error.message}`);
      throw new HttpException('Error obteniendo regiones de Chilexpress', 500);
    }
  }

  /**
   * Obtiene las áreas de cobertura (comunas) de una región específica desde Chilexpress
   * @param regionCode Código de región de Chilexpress
   * @param type 0 = Todas las áreas de cobertura
   */
  async getChilexpressCoverageAreas(
    regionCode: string,
    type: number = 0,
  ): Promise<ChilexpressCoverageArea[]> {
    const cacheKey = `${regionCode}-${type}`;
    
    if (this.chilexpressCoverageCache.has(cacheKey)) {
      return this.chilexpressCoverageCache.get(cacheKey)!;
    }

    const url = `https://testservices.wschilexpress.com/georeference/api/v1.0/coverage-areas?RegionCode=${regionCode}&type=${type}`;
    const headers = {
      'Cache-Control': 'no-cache',
      'Ocp-Apim-Subscription-Key': '247c52cd60cc45b281e92f83d165c135',
    };

    this.logger.debug(`Fetching Chilexpress coverage areas → GET ${url}`);

    try {
      const response$ = this.httpService.get(url, { headers });
      const response = await lastValueFrom(response$);

      if (response.data && response.data.coverageAreas) {
        this.chilexpressCoverageCache.set(cacheKey, response.data.coverageAreas);
        return response.data.coverageAreas;
      }

      this.logger.error(`No coverage areas found for region ${regionCode}`);
      return [];
    } catch (error: any) {
      this.logger.error(
        `Error fetching Chilexpress coverage areas for region ${regionCode}: ${error.message}`,
      );
      throw new HttpException(
        `Error obteniendo comunas de Chilexpress para región ${regionCode}`,
        500,
      );
    }
  }

  /**
   * Busca un countyCode de Chilexpress por nombre de comuna
   */
  async findChilexpressCountyByName(communeName: string): Promise<{
    countyCode: string;
    countyName: string;
    regionId: string;
  } | null> {
    const regions = await this.getChilexpressRegions();
    
    for (const region of regions) {
      const areas = await this.getChilexpressCoverageAreas(region.regionId);
      
      for (const area of areas) {
        if (
          area.countyName.toLowerCase().includes(communeName.toLowerCase()) ||
          area.coverageAreaName.toLowerCase().includes(communeName.toLowerCase())
        ) {
          return {
            countyCode: area.countyCode,
            countyName: area.countyName,
            regionId: region.regionId,
          };
        }
      }
    }
    
    return null;
  }

  /**
   * Obtiene regiones, provincias y comunas desde la API del gobierno (DPA)
   * y las guarda en memoria para reutilizar.
   */
  async getRegions(): Promise<GeoRegion[]> {
    if (this.cache) {
      return this.cache;
    }

    const version = 1;
    const base = `http://testservices.wschilexpress.com/georeference/api/v${version}`;

    const resRegions = await fetch(`${base}/regions`);
    if (!resRegions.ok) {
      throw new HttpException('Error obteniendo regiones', 500);
    }
    const regionsRaw = await resRegions.json();
    const regions: GeoRegion[] = [];

    for (const region of regionsRaw.regions) {
      const resCounties = await fetch(
        `${base}/coverage-areas?RegionCode=${region.regionId}&type=0`,
      );
      if (!resCounties.ok) {
        throw new HttpException('Error obteniendo provincias', 500);
      }
      const countiesRaw = await resCounties.json();
      regions.push({
        ...region,
        counties: countiesRaw.coverageAreas,
      });
    }

    this.cache = regions;
    return regions;
  }
}