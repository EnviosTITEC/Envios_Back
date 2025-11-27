import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '../schemas/delivery.schema';

export class RespuestaEnvioDto {
  @ApiProperty({ example: 'ENV-1734480000000-A3B7F9', description: 'Número de tracking único' })
  numero_seguimiento: string;

  @ApiProperty({ example: 'ENV-1734480000000-A3B7F9', description: 'Número de tracking (alias en camelCase)' })
  trackingNumber?: string;

  @ApiProperty({ example: 'Preparando', enum: DeliveryStatus, description: 'Estado actual del envío' })
  estado: DeliveryStatus;

  @ApiProperty({ example: 'pay_abc123', description: 'ID del pago' })
  pago_id: string;

  @ApiProperty({ example: 'cart_xyz789', description: 'ID del carrito' })
  carrito_id: string;

  @ApiProperty({ example: 'user_456', description: 'ID del usuario' })
  usuario_id: string;

  @ApiProperty({ example: 'seller_789', description: 'ID del vendedor' })
  vendedor_id: string;

  @ApiProperty({ example: 'Chilexpress', description: 'Nombre del carrier' })
  nombre_transportista: string;

  @ApiProperty({ example: 'PRIORITARIO', description: 'Tipo de servicio' })
  tipo_servicio: string;

  @ApiProperty({ example: 8812, description: 'Costo estimado' })
  costo_estimado: number;

  @ApiProperty({ example: 'CLP', description: 'Moneda' })
  moneda: string;

  @ApiProperty({ example: 'addr_12345', description: 'ID dirección origen' })
  origen_direccion_id: string;

  @ApiProperty({ example: 'addr_67890', description: 'ID dirección destino' })
  destino_direccion_id: string;

  @ApiProperty({ 
    example: [{ producto_id: 'prod_1', nombre: 'iPhone 14', cantidad: 1, precio: 899990 }],
    description: 'Items incluidos en el envío' 
  })
  articulos: Array<{
    producto_id: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;

  @ApiProperty({ example: '2024-12-20T10:00:00Z', description: 'Fecha estimada de entrega' })
  fecha_entrega_estimada?: Date;

  @ApiProperty({ example: '2024-12-17T15:30:00Z', description: 'Fecha de creación' })
  creado_en: Date;

  @ApiProperty({ example: 'Envío creado exitosamente. El vendedor ha sido notificado.', description: 'Mensaje informativo' })
  mensaje: string;
}
