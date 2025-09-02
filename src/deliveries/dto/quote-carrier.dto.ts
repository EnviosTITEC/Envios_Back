import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuoteCarrierDto {
  
  @ApiProperty()
  @IsString()
  origin_city_id: string;

  @ApiProperty()
  @IsString()
  destination_city_id: string;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiPropertyOptional({ type: () => Object })
  @IsOptional()
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiPropertyOptional({ enum: ['standard', 'express', 'overnight'], default: 'standard' })
  @IsOptional()
  @IsEnum(['standard', 'express', 'overnight'])
  delivery_speed?: 'standard' | 'express' | 'overnight';

  @ApiPropertyOptional()
  @IsOptional()
  insurance_value?: number;

  @ApiPropertyOptional()
  @IsOptional()
  fragile?: boolean;

  @ApiPropertyOptional({ default: 'CLP' })
  @IsOptional()
  currency?: string;

  constructor() {
    this.currency = 'CLP';
  }
}