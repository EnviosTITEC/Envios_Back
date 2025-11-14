import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  number: string;

  // Nombre de la comuna (Las Condes, Viña del Mar, etc.)
  @ApiProperty()
  @IsString()
  comune: string;

  // Código DPA de la comuna (13114, 5109, etc.) - OPCIONAL
  @ApiProperty({
    required: false,
    description: 'Código DPA de la comuna (opcional, se usa para cotizar)',
  })
  @IsOptional()
  @IsString()
  communeCode?: string;

  @ApiProperty()
  @IsString()
  province: string;

  @ApiProperty()
  @IsString()
  region: string;

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
