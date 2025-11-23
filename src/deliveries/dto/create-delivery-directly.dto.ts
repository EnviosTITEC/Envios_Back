import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class CartItemDto {
  @ApiProperty({ example: 'prod_12345', description: 'ID del producto' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'iPhone 14 Pro', description: 'Nombre del producto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Cantidad' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 899990, description: 'Precio unitario' })
  @IsNumber()
  price: number;
}

class PackageInfoDto {
  @ApiProperty({ example: 0.5, description: 'Peso en kg' })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 20, description: 'Largo en cm' })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 15, description: 'Ancho en cm' })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 10, description: 'Alto en cm' })
  @IsNumber()
  height: number;
}

class ShippingInfoDto {
  @ApiProperty({ example: 'addr_12345', description: 'ID de dirección de origen' })
  @IsString()
  @IsNotEmpty()
  originAddressId: string;

  @ApiProperty({ example: 'addr_67890', description: 'ID de dirección de destino' })
  @IsString()
  @IsNotEmpty()
  destinationAddressId: string;

  @ApiProperty({ example: 'Chilexpress', description: 'Nombre del carrier' })
  @IsString()
  @IsNotEmpty()
  carrierName: string;

  @ApiProperty({ example: 'PRIORITARIO', description: 'Tipo de servicio' })
  @IsString()
  @IsNotEmpty()
  serviceType: string;

  @ApiProperty({ example: 8812, description: 'Costo estimado del envío' })
  @IsNumber()
  estimatedCost: number;
}

/**
 * DTO para crear un envío directamente desde el frontend
 * SIN necesidad de un pago previo (para el flujo de cotización)
 */
export class CreateDeliveryDirectlyDto {
  @ApiProperty({ 
    example: 'user_456', 
    description: 'ID del usuario que crea el envío' 
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ 
    example: 'seller_789', 
    description: 'ID del vendedor' 
  })
  @IsString()
  @IsNotEmpty()
  sellerId: string;

  @ApiProperty({ 
    example: 'cart_xyz789', 
    description: 'ID del carrito (referencia)' 
  })
  @IsString()
  @IsOptional()
  cartId?: string;

  @ApiProperty({ 
    type: [CartItemDto],
    description: 'Items del envío' 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];

  @ApiProperty({ 
    type: PackageInfoDto,
    description: 'Información del paquete' 
  })
  @ValidateNested()
  @Type(() => PackageInfoDto)
  package: PackageInfoDto;

  @ApiProperty({ 
    type: ShippingInfoDto,
    description: 'Información de envío (previamente cotizada)' 
  })
  @ValidateNested()
  @Type(() => ShippingInfoDto)
  shippingInfo: ShippingInfoDto;

  @ApiProperty({ 
    example: 50000, 
    description: 'Valor declarado para seguro',
    required: false
  })
  @IsNumber()
  @IsOptional()
  declaredWorth?: number;

  @ApiProperty({ 
    example: 'Entregar en horario de oficina', 
    description: 'Notas adicionales',
    required: false
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
