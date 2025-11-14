import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PackageDto {
  @ApiProperty({ example: '16', description: 'Package weight (kg)' })
  @IsString()
  weight!: string;

  @ApiProperty({ example: '10', description: 'Package height (cm)' })
  @IsString()
  height!: string;

  @ApiProperty({ example: '20', description: 'Package width (cm)' })
  @IsString()
  width!: string;

  @ApiProperty({ example: '30', description: 'Package length (cm)' })
  @IsString()
  length!: string;
}

/**
 * DTO que recibe el endpoint /carriers/quote.
 * Importante: aquí usamos códigos DPA de comuna,
 * NO códigos internos de Chilexpress.
 */
export class DeliveryDto {
  @ApiProperty({
    example: '13101',
    description: 'Origin commune DPA code (API Gobierno)',
  })
  @IsString()
  originCommuneId!: string;

  @ApiProperty({
    example: '5109',
    description: 'Destination commune DPA code (API Gobierno)',
  })
  @IsString()
  destinationCommuneId!: string;

  @ApiProperty({ type: PackageDto })
  @ValidateNested()
  @Type(() => PackageDto)
  @IsObject()
  package!: PackageDto;

  @ApiProperty({ example: 3, description: 'Product type code' })
  @IsNumber()
  productType!: number;

  @ApiProperty({ example: 1, description: 'Content type code' })
  @IsNumber()
  contentType!: number;

  @ApiProperty({
    example: '2333',
    description: 'Declared worth (currency amount)',
  })
  @IsString()
  declaredWorth!: string;

  @ApiProperty({
    example: 0,
    description: 'Delivery time preference (0 = standard)',
  })
  @IsNumber()
  @Min(0)
  deliveryTime!: number;
}
