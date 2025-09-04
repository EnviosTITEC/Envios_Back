import { IsNotEmpty, IsString, IsBoolean, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarrierDto {

  @ApiProperty({ required: true, example: 'Transporte Rápido' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: ['Zona Norte', 'Zona Sur'], type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  coverageZones?: string[];

  @ApiProperty({ required: true, example: true })
  @IsBoolean()
  is_disabled?: boolean;

}
