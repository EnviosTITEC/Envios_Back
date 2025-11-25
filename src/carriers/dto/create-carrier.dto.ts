import { IsNotEmpty, IsString, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearTransportistaDto {

  @ApiProperty({ required: true, example: "DHL" })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ 
    required: true,
    example: {"X-API-AppKey": "Luke Skywalker", "X-API-AppToken": "R2D2"},
  })
  @IsJSON()
  @IsNotEmpty()
  credenciales: JSON;

  @ApiProperty({ required: true, example: true })
  @IsBoolean()
  disponible: boolean;

}
