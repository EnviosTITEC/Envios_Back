import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

class PackageInfoDto {
  @ApiProperty({
    example: '2.5',
    description: 'Peso del paquete en kilogramos (separado por punto)',
  })
  @IsString()
  weight!: string;

  @ApiProperty({
    example: '15',
    description: 'Alto del paquete en centímetros',
  })
  @IsString()
  height!: string;

  @ApiProperty({
    example: '25',
    description: 'Ancho del paquete en centímetros',
  })
  @IsString()
  width!: string;

  @ApiProperty({
    example: '35',
    description: 'Largo del paquete en centímetros',
  })
  @IsString()
  length!: string;
}

/**
 * DTO para solicitar cotización de envío.
 * Puede usar códigos DPA (legacy) o countyCode de Chilexpress directamente.
 */
export class QuoteRequestDto {
  @ApiPropertyOptional({
    example: '13101',
    description:
      'Código DPA de la comuna de origen (ej: 13101 = Santiago, 05109 = Viña del Mar). Usar solo si no se envía originCountyCode',
  })
  @IsString()
  @IsOptional()
  originCommuneId?: string;

  @ApiPropertyOptional({
    example: '05109',
    description:
      'Código DPA de la comuna de destino (ej: 13101 = Santiago, 05109 = Viña del Mar). Usar solo si no se envía destinationCountyCode',
  })
  @IsString()
  @IsOptional()
  destinationCommuneId?: string;

  @ApiPropertyOptional({
    example: 'STGO',
    description:
      'Código de cobertura de Chilexpress para origen (obtenido desde /geo/chilexpress/coverage-areas). Tiene prioridad sobre originCommuneId',
  })
  @IsString()
  @IsOptional()
  originCountyCode?: string;

  @ApiPropertyOptional({
    example: 'VAP',
    description:
      'Código de cobertura de Chilexpress para destino (obtenido desde /geo/chilexpress/coverage-areas). Tiene prioridad sobre destinationCommuneId',
  })
  @IsString()
  @IsOptional()
  destinationCountyCode?: string;

  @ApiProperty({
    type: PackageInfoDto,
    description: 'Información del paquete a enviar',
  })
  @ValidateNested()
  @Type(() => PackageInfoDto)
  @IsObject()
  package!: PackageInfoDto;

  @ApiProperty({
    example: 3,
    description: 'Tipo de producto: 1 = Documento, 3 = Encomienda',
    enum: [1, 3],
  })
  @IsNumber()
  @IsIn([1, 3], { message: 'productType debe ser 1 (Documento) o 3 (Encomienda)' })
  productType!: number;

  @ApiProperty({
    example: 1,
    description: 'Tipo de contenido del paquete',
  })
  @IsNumber()
  contentType!: number;

  @ApiProperty({
    example: '25000',
    description: 'Valor declarado del paquete en pesos chilenos',
  })
  @IsString()
  declaredWorth!: string;

  @ApiProperty({
    example: 0,
    description:
      'Servicios de entrega: 0 = Todos, 1 = Prioritarios, 2 = No prioritarios, 3 = De devolución',
    enum: [0, 1, 2, 3],
    default: 0,
  })
  @IsNumber()
  @IsIn([0, 1, 2, 3])
  @Min(0)
  @IsOptional()
  deliveryTime?: number = 0;
}
