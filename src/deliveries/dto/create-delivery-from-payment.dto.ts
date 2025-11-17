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
  @ApiProperty({ example: '5.5', description: 'Peso en kg' })
  @IsNumber()
  weight: number;

  @ApiProperty({ example: 45, description: 'Largo en cm' })
  @IsNumber()
  length: number;

  @ApiProperty({ example: 35, description: 'Ancho en cm' })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 25, description: 'Alto en cm' })
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
 * DTO para crear un envío desde una notificación de pago completado
 * Este endpoint será llamado por el microservicio de Pagos
 */
export class CreateDeliveryFromPaymentDto {
  @ApiProperty({ 
    example: 'pay_abc123', 
    description: 'ID del pago completado' 
  })
  @IsString()
  @IsNotEmpty()
  paymentId: string;

  @ApiProperty({ 
    example: 'cart_xyz789', 
    description: 'ID del carrito' 
  })
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({ 
    example: 'user_456', 
    description: 'ID del usuario comprador' 
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
    example: 950000, 
    description: 'Monto total del pago' 
  })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ 
    type: [CartItemDto],
    description: 'Items del carrito' 
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
    example: 'Envío de compra online - Manejar con cuidado', 
    description: 'Notas adicionales',
    required: false 
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
