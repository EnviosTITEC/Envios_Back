// src/geo/geo.module.ts
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeoService } from './geo.service';
import { GeoController } from './geo.controller';

@Module({
  imports: [HttpModule],
  controllers: [GeoController],
  providers: [GeoService],
  exports: [GeoService], // 👈 IMPORTANTE: exportar el servicio
})
export class GeoModule {}
