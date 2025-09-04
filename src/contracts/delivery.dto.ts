// Meant to use for creating/updating deliveries and quoting carriers

import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum, 
  IsBoolean, 
  IsDate, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum DeliverySpeed {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
}

export class DimensionsDto {
  @ApiProperty()
  @IsNumber()
  length: number;

  @ApiProperty()
  @IsNumber()
  width: number;

  @ApiProperty()
  @IsNumber()
  height: number;

  @ApiProperty()
  @IsNumber()
  weight: number;
}

export class DeliveryDto {
  @ApiProperty()
  @IsString()
  originPostalCode: string;

  @ApiProperty()
  @IsString()
  destinationPostalCode: string;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty({ type: () => DimensionsDto })
  @ValidateNested()
  @Type(() => DimensionsDto)
  dimensions: DimensionsDto;

  @ApiProperty({ 
    enum: DeliverySpeed, 
    default: DeliverySpeed.STANDARD, 
    required: false 
  })
  @IsOptional()
  @IsEnum(DeliverySpeed)
  deliverySpeed: DeliverySpeed = DeliverySpeed.STANDARD;

  @ApiProperty()
  @IsNumber()
  insuranceValue: number;

  @ApiProperty()
  @IsBoolean()
  fragile: boolean;

  @ApiProperty({ default: 'CLP' })
  @IsString()
  currency: string = 'CLP';

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  pickupDate: Date;
}
