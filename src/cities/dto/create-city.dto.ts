import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {

  @ApiProperty({ required: true, example: "Santo Domingo" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true, example: "2720000" })
  @IsString()
  @IsNotEmpty()
  postal_code: string;
}
