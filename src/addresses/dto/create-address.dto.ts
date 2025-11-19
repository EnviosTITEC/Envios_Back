import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsString()
  communeId: string;

  @ApiProperty({
    required: false,
    description: 'Código Chilexpress',
  })
  @IsOptional()
  @IsString()
  countyCode?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty()
  @IsString()
  regionId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  references?: string;

  @ApiProperty()
  @IsString()
  userId: string;
}
