import { Injectable, HttpException, NotFoundException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

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

export interface GeoCounty {
  countyCode: string;
  countyName: string;
  regionCode: string;
  ineCountyCode: string;
  queryMode: string;
  coverageName: string;
  ind_ppd: number;
  ind_rd: number;
}

  /**
   * Obtiene regiones, provincias y comunas desde la API del gobierno (DPA)
   * y las guarda en memoria para reutilizar.
   */

  export interface GeoRegion {
    regionId: string;
    regionName: string;
    ineRegionCode: number;
    counties: GeoCounty[];
  }

  @Injectable()
  export class GeoService {
    private cache: GeoRegion[] | null = null;

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
