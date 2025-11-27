import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ArticuloCarritoDto {
  @ApiProperty({ example: 'prod_12345', description: 'ID del producto' })
  @IsString()
  @IsNotEmpty()
  producto_id: string;

  @ApiProperty({ example: 'iPhone 14 Pro', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 1, description: 'Cantidad' })
  @IsNumber()
  cantidad: number;

  @ApiProperty({ example: 899990, description: 'Precio unitario' })
  @IsNumber()
  precio: number;
}

class InfoPaqueteDto {
  @ApiProperty({ example: 0.5, description: 'Peso en kg' })
  @IsNumber()
  peso: number;

  @ApiProperty({ example: 20, description: 'Largo en cm' })
  @IsNumber()
  largo: number;

  @ApiProperty({ example: 15, description: 'Ancho en cm' })
  @IsNumber()
  ancho: number;

  @ApiProperty({ example: 10, description: 'Alto en cm' })
  @IsNumber()
  alto: number;
}

class InfoEnvioDto {
  @ApiProperty({ example: 'addr_12345', description: 'ID de dirección de origen' })
  @IsString()
  @IsNotEmpty()
  origen_direccion_id: string;

  @ApiProperty({ example: 'addr_67890', description: 'ID de dirección de destino' })
  @IsString()
  @IsNotEmpty()
  destino_direccion_id: string;

  @ApiProperty({ example: 'Chilexpress', description: 'Nombre del carrier' })
  @IsString()
  @IsNotEmpty()
  nombre_transportista: string;

  @ApiProperty({ example: 'PRIORITARIO', description: 'Tipo de servicio' })
  @IsString()
  @IsNotEmpty()
  tipo_servicio: string;

  @ApiProperty({ example: 8812, description: 'Costo estimado del envío' })
  @IsNumber()
  costo_estimado: number;
}

/**
 * DTO para crear un envío directamente desde el frontend
 * SIN necesidad de un pago previo (para el flujo de cotización)
 */
export class CrearEnvioDirectoDto {
  @ApiProperty({ 
    example: 'user_456', 
    description: 'ID del usuario que crea el envío' 
  })
  @IsString()
  @IsNotEmpty()
  usuario_id: string;

  @ApiProperty({ 
    example: 'seller_789', 
    description: 'ID del vendedor' 
  })
  @IsString()
  @IsNotEmpty()
  vendedor_id: string;

  @ApiProperty({ 
    example: 'cart_xyz789', 
    description: 'ID del carrito (referencia)' 
  })
  @IsString()
  @IsOptional()
  carrito_id?: string;

  @ApiProperty({ 
    type: [ArticuloCarritoDto],
    description: 'Items del envío' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArticuloCarritoDto)
  articulo_carrito: ArticuloCarritoDto[];

  @ApiProperty({ 
    type: InfoPaqueteDto,
    description: 'Información del paquete' 
  })
  @ValidateNested()
  @Type(() => InfoPaqueteDto)
  paquete: InfoPaqueteDto;

  @ApiProperty({ 
    type: InfoEnvioDto,
    description: 'Información de envío (previamente cotizada)' 
  })
  @ValidateNested()
  @Type(() => InfoEnvioDto)
  informacion_envio: InfoEnvioDto;

  @ApiProperty({ 
    example: 50000, 
    description: 'Valor declarado para seguro',
    required: false
  })
  @IsNumber()
  @IsOptional()
  valor_declarado?: number;

  @ApiProperty({ 
    example: 'Entregar en horario de oficina', 
    description: 'Notas adicionales',
    required: false
  })
  @IsString()
  @IsOptional()
  notas?: string;
}
