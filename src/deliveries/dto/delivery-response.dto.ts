import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '../schemas/delivery.schema';

export class DeliveryResponseDto {
  @ApiProperty({ example: 'ENV-1734480000000-A3B7F9', description: 'Número de tracking único' })
  trackingNumber: string;

  @ApiProperty({ example: 'Preparando', enum: DeliveryStatus, description: 'Estado actual del envío' })
  status: DeliveryStatus;

  @ApiProperty({ example: 'pay_abc123', description: 'ID del pago' })
  paymentId: string;

  @ApiProperty({ example: 'cart_xyz789', description: 'ID del carrito' })
  cartId: string;

  @ApiProperty({ example: 'user_456', description: 'ID del usuario' })
  userId: string;

  @ApiProperty({ example: 'seller_789', description: 'ID del vendedor' })
  sellerId: string;

  @ApiProperty({ example: 'Chilexpress', description: 'Nombre del carrier' })
  carrierName: string;

  @ApiProperty({ example: 'PRIORITARIO', description: 'Tipo de servicio' })
  serviceType: string;

  @ApiProperty({ example: 8812, description: 'Costo estimado' })
  estimatedCost: number;

  @ApiProperty({ example: 'CLP', description: 'Moneda' })
  currency: string;

  @ApiProperty({ example: 'addr_12345', description: 'ID dirección origen' })
  originAddressId: string;

  @ApiProperty({ example: 'addr_67890', description: 'ID dirección destino' })
  destinationAddressId: string;

  @ApiProperty({ 
    example: [{ productId: 'prod_1', name: 'iPhone 14', quantity: 1, price: 899990 }],
    description: 'Items incluidos en el envío' 
  })
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;

  @ApiProperty({ example: '2024-12-20T10:00:00Z', description: 'Fecha estimada de entrega' })
  estimatedDeliveryDate?: Date;

  @ApiProperty({ example: '2024-12-17T15:30:00Z', description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ example: 'Envío creado exitosamente. El vendedor ha sido notificado.', description: 'Mensaje informativo' })
  message: string;
}
