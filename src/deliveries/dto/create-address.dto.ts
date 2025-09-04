import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {

  @ApiProperty({ required: true, example: 'Av. Siempre Viva' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ required: true, example: '742' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ required: true, example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  comune: string;

  @ApiProperty({ required: true, example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiProperty({ required: true, example: 'Región Metropolitana' })
  @IsString()
  @IsNotEmpty()
  region?: string;

  @ApiProperty({ required: true, example: '1234567' })
  @IsString()
  @IsNotEmpty()
  postalCode?: string;

  @ApiPropertyOptional({ required: true, example: 'Casa azul, portón rojo' })
  @IsString()
  references?: string;

  @ApiProperty({ required: true, example: 'userId123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

}
