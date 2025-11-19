import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearCiudadDto {

  @ApiProperty({ required: true, example: "Santo Domingo", description: "Nombre de la ciudad" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ required: true, example: "2720000", description: "Código postal de la ciudad" })
  @IsString()
  @IsNotEmpty()
  codigo_postal: string;
}
