import { PartialType } from '@nestjs/mapped-types';
import { CrearCiudadDto } from './create-city.dto.js';

export class ActualizarCiudadDto extends PartialType(CrearCiudadDto) {}
