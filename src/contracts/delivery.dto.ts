import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsObject, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PackageDto {
  @ApiProperty({ example: '16', description: 'Package weight (kg)' })
  @IsString()
  weight!: string;

  @ApiProperty({ example: '1', description: 'Package height (cm)' })
  @IsString()
  height!: string;

  @ApiProperty({ example: '1', description: 'Package width (cm)' })
  @IsString()
  width!: string;

  @ApiProperty({ example: '1', description: 'Package length (cm)' })
  @IsString()
  length!: string;
}

export class DeliveryDto {
  @ApiProperty({ example: 'STGO', description: 'Origin county code' })
  @IsString()
  originCountyCode!: string;

  @ApiProperty({ example: 'PROV', description: 'Destination county code' })
  @IsString()
  destinationCountyCode!: string;

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

  @ApiProperty({ example: '2333', description: 'Declared worth (currency amount)' })
  @IsString()
  declaredWorth!: string;

  @ApiProperty({ example: 0, description: 'Delivery time preference (0 = standard)' })
  @IsNumber()
  @Min(0)
  deliveryTime!: number;
}
