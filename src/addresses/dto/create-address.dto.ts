import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CrearDireccionDto {
  @ApiProperty()
  @IsString()
  calle: string;

  @ApiProperty()
  @IsString()
  numero: string;

  @ApiProperty()
  @IsString()
  comuna_id: string;

  @ApiProperty({
    required: false,
    description: 'Código Chilexpress',
  })
  @IsOptional()
  @IsString()
  codigo_comuna?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  provincia?: string;

  @ApiProperty()
  @IsString()
  region_id: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  codigo_postal?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  referencias?: string;

  @ApiProperty()
  @IsString()
  usuario_id: string;
}
