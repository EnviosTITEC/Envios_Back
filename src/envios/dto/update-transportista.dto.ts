import { PartialType } from '@nestjs/mapped-types';
import { CreateTransportistaDto } from './create-transportista.dto';

export class UpdateTransportistaDto extends PartialType(CreateTransportistaDto) {}
