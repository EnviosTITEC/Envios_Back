import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDireccionDto {
  @ApiProperty({ example: 'Av. Siempre Viva' })
  @IsString()
  @IsNotEmpty()
  calle: string;

  @ApiProperty({ example: '742' })
  @IsString()
  @IsNotEmpty()
  numero: string;

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  comuna: string;

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  provincia: string;

  @ApiPropertyOptional({ example: 'Región Metropolitana' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: '1234567' })
  @IsString()
  @IsOptional()
  codigoPostal?: string;

  @ApiPropertyOptional({ example: 'Casa azul, portón rojo' })
  @IsString()
  @IsOptional()
  referencias?: string;

  @ApiProperty({ example: 'userId123' })
  @IsString()
  @IsNotEmpty()
  usuarioId: string;
}
