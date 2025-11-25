import { PartialType } from '@nestjs/mapped-types';
import { CrearTransportistaDto } from './create-carrier.dto';

export class ActualizarTransportistaDto extends PartialType(CrearTransportistaDto) {}
