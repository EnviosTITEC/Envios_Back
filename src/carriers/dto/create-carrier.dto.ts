import { IsNotEmpty, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarrierDto {

  @ApiProperty({ required: true, example: "DHL001", description: "Código único del transportista" })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({ required: true, example: "DHL", description: "Nombre del transportista" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ 
    required: true,
    example: {"X-API-AppKey": "Clave API", "X-API-AppToken": "Token API"},
    description: "Credenciales del transportista en formato JSON"
  })
  @IsNotEmpty()
  credenciales: Record<string, string>;

  @ApiProperty({ required: true, example: true, description: "Indica si el transportista está disponible" })
  @IsBoolean()
  disponible: boolean;

}
