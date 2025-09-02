import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarrierDto {
  @ApiProperty({ example: 'Transporte Rápido' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: ['Zona Norte', 'Zona Sur'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  coverageZones?: string[];

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @ApiPropertyOptional({
    example: { 'Zona Norte': 5000, 'Zona Sur': 7000 },
    type: 'object',
    additionalProperties: { type: 'number' },
  })
  @IsOptional()
  fee?: Record<string, number>; // { "Zona Norte": 5000, "Zona Sur": 7000 }
}
