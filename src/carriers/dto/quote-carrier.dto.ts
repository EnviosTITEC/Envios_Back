import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ type: () => Object })
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };

  @ApiProperty({ 
    required: true,
    enum: ['standard', 'express', 'overnight'],
    default: 'standard' 
  })
  @IsOptional()
  @IsEnum(['standard', 'express', 'overnight'])
  delivery_speed?: 'standard' | 'express' | 'overnight';

  @ApiProperty({ required: true })
  insurance_value?: number;

  @ApiProperty({ required: true })
  fragile?: boolean;

  @ApiProperty({ required: true, default: 'CLP' })
  currency?: string;

  constructor() {
    this.currency = 'CLP';
  }
}