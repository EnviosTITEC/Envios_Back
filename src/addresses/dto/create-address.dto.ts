import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ example: 'calle falsa', description: 'nombre de la calle' })
  @IsString()
  nombre_calle: string; // Cambiado de 'street'

  @ApiProperty({ example: '123', description: 'número de la dirección' })
  @IsString()
  numero: string; // Cambiado de 'number'

  @ApiProperty({ example: '13101', description: 'id de la comuna' })
  @IsString()
  id_comuna: string; // Cambiado de 'communeId'

  @ApiProperty({
    required: false,
    example: 'SCL',
    description: 'código chilexpress de la comuna',
  })
  @IsOptional()
  @IsString()
  codigo_comuna?: string; // Cambiado de 'countyCode'

  @ApiProperty({
    required: false,
    example: 'provincia central',
    description: 'nombre de la provincia',
  })
  @IsOptional()
  @IsString()
  nombre_provincia?: string; // Cambiado de 'province'

  @ApiProperty({ example: '13', description: 'id de la región' })
  @IsString()
  id_region: string; // Cambiado de 'regionId'

  @ApiProperty({
    required: false,
    example: '12345',
    description: 'código postal',
  })
  @IsOptional()
  @IsString()
  codigo_postal?: string; // Cambiado de 'postalCode'

  @ApiProperty({
    required: false,
    example: 'casa amarilla',
    description: 'referencias adicionales',
  })
  @IsOptional()
  @IsString()
  referencias?: string; // Cambiado de 'references'

  @ApiProperty({ example: 'usuario_123', description: 'id del usuario asociado' })
  @IsString()
  id_usuario: string; // Cambiado de 'userId'
}
