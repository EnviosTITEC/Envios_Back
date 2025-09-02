import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ example: 'Av. Siempre Viva' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ example: '742' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  comune: string;

  @ApiProperty({ example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  province: string;

  @ApiPropertyOptional({ example: 'Región Metropolitana' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: '1234567' })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'Casa azul, portón rojo' })
  @IsString()
  @IsOptional()
  references?: string;

  @ApiProperty({ example: 'userId123' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
