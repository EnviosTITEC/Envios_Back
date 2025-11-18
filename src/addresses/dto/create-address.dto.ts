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

  // Código Chilexpress (STGO, VDMAR, etc.)
  @ApiProperty({
    required: false,
    description: 'Código Chilexpress (opcional, se usa para cotizar)',
  })
  @IsOptional()
  @IsString()
  countyCode?: string;

  @ApiProperty({
    required: false,
    description: 'Nombre de la provincia (opcional, dejado por compatibilidad)',
  })
  @IsOptional()
  @IsString()
  province?: string;

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
