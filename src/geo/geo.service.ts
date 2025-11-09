import { Injectable, HttpException } from '@nestjs/common';

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
}
