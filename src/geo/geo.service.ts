import { Injectable, HttpException, NotFoundException } from '@nestjs/common';

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
