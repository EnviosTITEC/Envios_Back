import { PartialType } from '@nestjs/mapped-types';
import { CrearUsuarioDto } from './create-user.dto';

export class ActualizarUsuarioDto extends PartialType(CrearUsuarioDto) {}