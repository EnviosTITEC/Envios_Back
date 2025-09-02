import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCityDto {

  @ApiProperty({example: "Los Ángeles"})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;
}
