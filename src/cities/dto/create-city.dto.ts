import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  code: string;
}
