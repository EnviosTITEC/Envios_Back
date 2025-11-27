import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCiudadDto {

  @ApiProperty({ required: true, example: "Santo Domingo" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ required: true, example: "2720000" })
  @IsString()
  @IsNotEmpty()
  codigo_postal: string;
}
