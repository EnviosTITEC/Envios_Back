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

export interface GeoRegion {
  code: string;
  name: string;
  provinces: GeoProvince[];
}

// Interfaces para Chilexpress API
export interface ChilexpressRegion {
  regionId: string;
  regionName: string;
  regionCode: string;
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
    regionCode: string;
  } | null> {
    const regions = await this.getChilexpressRegions();
    
    for (const region of regions) {
      const areas = await this.getChilexpressCoverageAreas(region.regionCode);
      
      for (const area of areas) {
        if (
          area.countyName.toLowerCase().includes(communeName.toLowerCase()) ||
          area.coverageAreaName.toLowerCase().includes(communeName.toLowerCase())
        ) {
          return {
            countyCode: area.countyCode,
            countyName: area.countyName,
            regionCode: region.regionCode,
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

    const base = 'https://apis.digital.gob.cl/dpa';

    const resRegions = await fetch(`${base}/regiones`);
    if (!resRegions.ok) {
      throw new HttpException('Error obteniendo regiones', 500);
    }
    const regionsRaw = await resRegions.json();

    const regions: GeoRegion[] = [];

    for (const region of regionsRaw) {
      const resProvinces = await fetch(
        `${base}/regiones/${region.codigo}/provincias`,
      );
      if (!resProvinces.ok) {
        throw new HttpException('Error obteniendo provincias', 500);
      }
      const provincesRaw = await resProvinces.json();

      const provinces: GeoProvince[] = [];

      for (const prov of provincesRaw) {
        const resCommunes = await fetch(
          `${base}/provincias/${prov.codigo}/comunas`,
        );
        if (!resCommunes.ok) {
          throw new HttpException('Error obteniendo comunas', 500);
        }
        const communesRaw = await resCommunes.json();

        const communes = Array.isArray(communesRaw)
          ? communesRaw.map((c: any) => ({
              code: c.codigo,
              name: c.nombre,
            }))
          : [];

        provinces.push({
          code: prov.codigo,
          name: prov.nombre,
          communes,
        });
      }

      regions.push({
        code: region.codigo,
        name: region.nombre,
        provinces,
      });
    }

    this.cache = regions;
    return regions;
  }

  /**
   * Mapping MUY sencillo de DPA/nombre → códigos Chilexpress.
   * Esto es solo para tu demo: cubre Santiago y Valparaíso.
   */
  findChilexpressCountyByCommuneId(communeId: string): {
    chilexpressCountyCode: string;
    chilexpressCountyName: string;
  } {
    const raw = (communeId ?? '').toString().trim();
    const id = raw.toLowerCase();

    // 👉 Región Metropolitana → usamos código genérico "STGO"
    if (
      id === '13101' || // Santiago (DPA)
      id === '13114' || // Las Condes (DPA)
      id === 'las condes' ||
      id === 'santiago' ||
      id === 'providencia'
    ) {
      return {
        chilexpressCountyCode: 'STGO',
        chilexpressCountyName: 'SANTIAGO',
      };
    }

    // 👉 Región de Valparaíso → código genérico "PROV"
    if (
      id === '5101' ||
      id === 'valparaíso' ||
      id === 'valparaiso' ||
      id === 'viña del mar' ||
      id === 'vina del mar'
    ) {
      return {
        chilexpressCountyCode: 'PROV',
        chilexpressCountyName: 'VALPARAÍSO',
      };
    }

    // Si llegamos acá, no tenemos mapping
    throw new NotFoundException(
      `No existe mapping Chilexpress para communeId=${raw}`,
    );
  }
}
