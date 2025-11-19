import { PartialType } from '@nestjs/mapped-types';
import { CrearCiudadDto } from './create-city.dto';

export class UpdateCityDto extends PartialType(CrearCiudadDto) {}
