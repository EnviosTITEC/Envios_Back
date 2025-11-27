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

class InfoPaqueteDto {
  @ApiProperty({
    example: '2.5',
    description: 'Peso del paquete en kilogramos (separado por punto)',
  })
  @IsString()
  peso!: string;

  @ApiProperty({
    example: '15',
    description: 'Alto del paquete en centímetros',
  })
  @IsString()
  alto!: string;

  @ApiProperty({
    example: '25',
    description: 'Ancho del paquete en centímetros',
  })
  @IsString()
  ancho!: string;

  @ApiProperty({
    example: '35',
    description: 'Largo del paquete en centímetros',
  })
  @IsString()
  largo!: string;
}

/**
 * DTO para solicitar cotización de envío.
 * Puede usar códigos DPA (legacy) o countyCode de Chilexpress directamente.
 */
export class SolicitudCotizacionDto {
  @ApiPropertyOptional({
    example: '13101',
    description:
      'Código DPA de la comuna de origen (ej: 13101 = Santiago, 05109 = Viña del Mar). Usar solo si no se envía codigo_cobertura_origen',
  })
  @IsString()
  @IsOptional()
  comuna_origen_id?: string;

  @ApiPropertyOptional({
    example: '05109',
    description:
      'Código DPA de la comuna de destino (ej: 13101 = Santiago, 05109 = Viña del Mar). Usar solo si no se envía codigo_cobertura_destino',
  })
  @IsString()
  @IsOptional()
  comuna_destino_id?: string;

  @ApiPropertyOptional({
    example: 'STGO',
    description:
      'Código de cobertura de Chilexpress para origen (obtenido desde /geo/chilexpress/coverage-areas). Tiene prioridad sobre comuna_origen_id',
  })
  @IsString()
  @IsOptional()
  codigo_cobertura_origen?: string;

  @ApiPropertyOptional({
    example: 'VAP',
    description:
      'Código de cobertura de Chilexpress para destino (obtenido desde /geo/chilexpress/coverage-areas). Tiene prioridad sobre comuna_destino_id',
  })
  @IsString()
  @IsOptional()
  codigo_cobertura_destino?: string;

  @ApiProperty({
    type: InfoPaqueteDto,
    description: 'Información del paquete a enviar',
  })
  @ValidateNested()
  @Type(() => InfoPaqueteDto)
  @IsObject()
  paquete!: InfoPaqueteDto;

  @ApiProperty({
    example: 3,
    description: 'Tipo de producto: 1 = Documento, 3 = Encomienda',
    enum: [1, 3],
  })
  @IsNumber()
  @IsIn([1, 3], { message: 'tipo_producto debe ser 1 (Documento) o 3 (Encomienda)' })
  tipo_producto!: number;

  @ApiProperty({
    example: 1,
    description: 'Tipo de contenido del paquete',
  })
  @IsNumber()
  tipo_contenido!: number;

  @ApiProperty({
    example: '25000',
    description: 'Valor declarado del paquete en pesos chilenos',
  })
  @IsString()
  valor_declarado!: string;

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
  tiempo_entrega?: number = 0;
}
