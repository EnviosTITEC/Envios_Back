import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTransportistaDto {
  @ApiProperty({ example: 'Transporte Rápido' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ example: ['Zona Norte', 'Zona Sur'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  zonasCobertura?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  disponible?: boolean;

  @ApiPropertyOptional({
    example: { 'Zona Norte': 5000, 'Zona Sur': 7000 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @IsOptional()
  tarifas?: Record<string, number>; // { "Zona Norte": 5000, "Zona Sur": 7000 }
}
