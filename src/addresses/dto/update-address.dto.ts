
import { PartialType } from '@nestjs/swagger';
import { CrearDireccionDto } from './create-address.dto';

export class ActualizarDireccionDto extends PartialType(CrearDireccionDto) {}
