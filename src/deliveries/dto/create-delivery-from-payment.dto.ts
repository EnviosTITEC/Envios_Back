import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @ApiProperty({ example: 'prod_12345', description: 'ID del producto' })
  @IsString()
  @IsNotEmpty()
  id_producto: string; // Cambiado de 'productId'

  @ApiProperty({ example: 'iPhone 14 Pro', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  nombre: string; // Cambiado de 'name'

  @ApiProperty({ example: 1, description: 'Cantidad' })
  @IsNumber()
  cantidad: number; // Cambiado de 'quantity'

  @ApiProperty({ example: 899990, description: 'Precio unitario' })
  @IsNumber()
  precio: number; // Cambiado de 'price'
}

class PackageInfoDto {
  @ApiProperty({ example: '5.5', description: 'Peso en kg' })
  @IsNumber()
  peso: number; // Cambiado de 'weight'

  @ApiProperty({ example: 45, description: 'Largo en cm' })
  @IsNumber()
  largo: number; // Cambiado de 'length'

  @ApiProperty({ example: 35, description: 'Ancho en cm' })
  @IsNumber()
  ancho: number; // Cambiado de 'width'

  @ApiProperty({ example: 25, description: 'Alto en cm' })
  @IsNumber()
  alto: number; // Cambiado de 'height'
}

class ShippingInfoDto {
  @ApiProperty({ example: 'addr_12345', description: 'ID de dirección de origen' })
  @IsString()
  @IsNotEmpty()
  id_direccion_origen: string; // Cambiado de 'originAddressId'

  @ApiProperty({ example: 'addr_67890', description: 'ID de dirección de destino' })
  @IsString()
  @IsNotEmpty()
  id_direccion_destino: string; // Cambiado de 'destinationAddressId'

  @ApiProperty({ example: 'Chilexpress', description: 'Nombre del carrier' })
  @IsString()
  @IsNotEmpty()
  nombre_transportista: string; // Cambiado de 'carrierName'

  @ApiProperty({ example: 'PRIORITARIO', description: 'Tipo de servicio' })
  @IsString()
  @IsNotEmpty()
  tipo_servicio: string; // Cambiado de 'serviceType'

  @ApiProperty({ example: 8812, description: 'Costo estimado del envío' })
  @IsNumber()
  costo_estimado: number; // Cambiado de 'estimatedCost'
}

/**
 * DTO para crear un envío desde una notificación de pago completado
 * Este endpoint será llamado por el microservicio de Pagos
 */
export class CreateDeliveryFromPaymentDto {
  @ApiProperty({ 
    example: 'pago_12345', 
    description: 'ID del pago completado' 
  })
  @IsString()
  @IsNotEmpty()
  id_pago: string;

  @ApiProperty({ 
    example: 'carrito_67890', 
    description: 'ID del carrito de compras' 
  })
  @IsString()
  @IsNotEmpty()
  id_carrito: string;

  @ApiProperty({ 
    example: 'usuario_123', 
    description: 'ID del usuario comprador' 
  })
  @IsString()
  @IsNotEmpty()
  id_usuario: string;

  @ApiProperty({ 
    example: 'vendedor_456', 
    description: 'ID del vendedor asociado' 
  })
  @IsString()
  @IsNotEmpty()
  id_vendedor: string;

  @ApiProperty({ 
    example: 950000, 
    description: 'Monto total del pago en pesos chilenos' 
  })
  @IsNumber()
  monto_total: number;

  @ApiProperty({ 
    type: [CartItemDto],
    description: 'Lista de productos en el carrito' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ 
    type: PackageInfoDto,
    description: 'Información del paquete a enviar' 
  })
  @ValidateNested()
  @Type(() => PackageInfoDto)
  paquete: PackageInfoDto;

  @ApiProperty({ 
    type: ShippingInfoDto,
    description: 'Información del envío previamente cotizado' 
  })
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  info_envio: ShippingInfoDto;

  @ApiProperty({ 
    example: 50000, 
    description: 'Valor declarado del paquete para seguro',
    required: false 
  })
  @IsNumber()
  @IsOptional()
  valor_declarado?: number;

  @ApiProperty({ 
    example: 'Manejar con cuidado, contiene artículos frágiles', 
    description: 'Notas adicionales para el envío',
    required: false 
  })
  @IsString()
  @IsOptional()
  notas?: string;
}
