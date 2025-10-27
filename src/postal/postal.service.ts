import { Injectable, HttpException } from '@nestjs/common';

export interface PostalCommune {
  code: string;
  name: string;
}

export interface PostalProvince {
  code: string;
  name: string;
  communes: PostalCommune[];
}

export interface PostalRegion {
  code: string;
  name: string;
  provinces: PostalProvince[];
}

@Injectable()
export class PostalService {
  private cache: PostalRegion[] | null = null;

  async getRegionsTree(): Promise<PostalRegion[]> {
    if (this.cache) {
      return this.cache;
    }

    const base = 'https://apis.digital.gob.cl/dpa';

    const resRegions = await fetch(`${base}/regiones`);
    if (!resRegions.ok) {
      throw new HttpException('Error obteniendo regiones', 500);
    }
    const regionsRaw = await resRegions.json();

    const regions: PostalRegion[] = [];

    for (const region of regionsRaw) {
      const resProvinces = await fetch(
        `${base}/regiones/${region.codigo}/provincias`,
      );
      if (!resProvinces.ok) {
        throw new HttpException('Error obteniendo provincias', 500);
      }
      const provincesRaw = await resProvinces.json();

      const provinces: PostalProvince[] = [];

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
